import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import Votes from "@/components/shared/votes";
import Answer from "@/components/forms/answer";
import Metric from "@/components/shared/metric";
import ParseHTML from "@/components/shared/parse-html";
import RenderTag from "@/components/shared/render-tags";
import AllAnswers from "@/components/shared/all-answers";

import { getUserById } from "@/lib/actions/user.action";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";

const QuestionDetail = async ({ params, searchParams }: any) => {
    // Access to mongo user
    const { userId: clerkId } = auth();
    let mongoUser;
    if (clerkId) {
        mongoUser = await getUserById({ userId: clerkId });
    }

    const result = await getQuestionById({ questionId: params.id });

    if (mongoUser === undefined || mongoUser === null) {
        return;
    }

    return (
        <>
            <div className="flex-start w-full flex-col">
                <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                    <Link
                        href={`/profile/${result.author.clerkId}`}
                        className="flex items-center justify-start gap-1"
                    >
                        <Image
                            src={result.author.picture}
                            alt={result.author.name}
                            width={22}
                            height={22}
                            className="rounded-full"
                        />
                        <p className="paragraph-semibold text-dark300_light700">
                            {result.author.name}
                        </p>
                    </Link>

                    <div className="flex justify-end">
                        <Votes
                            type="question"
                            itemId={JSON.stringify(result._id)}
                            userId={JSON.stringify(mongoUser._id)}
                            upvotes={result.upvotes.length}
                            hasUpvoted={result.upvotes.includes(mongoUser._id)}
                            downvotes={result.downvotes.length}
                            hasDownvoted={result.downvotes.includes(
                                mongoUser._id,
                            )}
                            hasSaved={mongoUser?.saved.includes(result._id)}
                        />
                    </div>
                </div>

                <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
                    {result.title}
                </h2>
            </div>

            <div className="mb-8 mt-5 flex flex-wrap gap-4">
                {/* Votes */}
                <Metric
                    imgUrl="/assets/icons/clock.svg"
                    alt="clock icon"
                    value={` asked ${getTimestamp(result.createdAt)}`}
                    title="Asked"
                    textStyle="small-medium text-dark400_light800"
                />

                {/* Message */}
                <Metric
                    imgUrl="/assets/icons/message.svg"
                    alt="message"
                    value={formatAndDivideNumber(result.answers.length)}
                    title="Answers"
                    textStyle="small-medium text-dark400_light800"
                />

                {/* Views */}
                <Metric
                    imgUrl="/assets/icons/eye.svg"
                    alt="eye"
                    value={formatAndDivideNumber(result.views)}
                    title="Views"
                    textStyle="small-medium text-dark400_light800"
                />
            </div>

            {/* Question content */}
            <ParseHTML html={result.content} />

            <div className="mt-8 flex flex-wrap gap-2">
                {result.tags.map((tag: any) => (
                    <RenderTag
                        key={tag._id}
                        _id={tag._id}
                        name={tag.name}
                        showCount={false}
                    />
                ))}
            </div>

            <AllAnswers
                questionId={result._id}
                userId={JSON.stringify(mongoUser._id)}
                totalAnswers={result.answers.length}
            />

            <Answer
                question={result.content}
                questionId={JSON.stringify(result._id)}
                authorId={JSON.stringify(mongoUser._id)}
            />
        </>
    );
};
export default QuestionDetail;
