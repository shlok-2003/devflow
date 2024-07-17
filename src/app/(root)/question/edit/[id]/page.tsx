import { auth } from "@clerk/nextjs/server";

import Question from "@/components/forms/question";

import { ParamsProps } from "@/types";
import { getUserById } from "@/lib/actions/user.action";
import { getQuestionById } from "@/lib/actions/question.action";

const EditQuestion = async ({ params }: ParamsProps) => {
    const { userId } = auth();

    if (!userId) return null;

    const mongoUser = await getUserById({ userId });

    const result = await getQuestionById({ questionId: params.id });

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

            <div className="mt-9">
                <Question
                    type="edit"
                    mongoUserId={
                        mongoUser ? (mongoUser._id as unknown as string) : ""
                    }
                    questionDetails={JSON.stringify(result)}
                />
            </div>
        </>
    );
};
export default EditQuestion;
