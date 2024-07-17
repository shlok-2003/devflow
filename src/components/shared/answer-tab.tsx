import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "@/components/cards/answer-card";
import Pagination from "./pagination";

interface Props extends SearchParamsProps {
    userId: string;
    clerkId?: string | null;
}
const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
    const result = await getUserAnswers({
        userId,
        page: searchParams.page ? +searchParams.page : 1,
    });

    return (
        <>
            {result.answers.map((answer: any) => (
                <AnswerCard
                    key={answer._id}
                    clerkId={clerkId}
                    _id={answer._id}
                    question={answer.question}
                    author={answer.author}
                    upvotes={answer.upvotes.length}
                    createdAt={answer.createdAt}
                />
            ))}

            {/* Pagination */}
            <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={result.isNextAnswers}
            />
        </>
    );
};
export default AnswersTab;
