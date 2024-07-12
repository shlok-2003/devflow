// "use server";

// import { revalidatePath } from "next/cache";
// import { connectToDatabase } from "@/lib/mongoose";

// import Question from "@/database/question.model";
// import Answer, { IAnswer } from "@/database/answer.model";

// import { CreateAnswerParams, GetAnswersParams } from "./shared.types";

// export async function createAnswer(params: CreateAnswerParams) {
//     try {
//         connectToDatabase();

//         const { content, author, question, path } = params;

//         const answer: IAnswer = new Answer({
//             content,
//             author,
//             question,
//         });

//         // Add the answer to the question answer array
//         await Question.findByIdAndUpdate(question, {
//             $push: { answers: answer._id },
//         });

//         // TODO: Add interactions...

//         revalidatePath(path);
//     } catch (error) {
//         console.error(`❌ ${error} ❌`);
//         throw error;
//     }
// }
// export async function getAnswers(params: GetAnswersParams) {
//     try {
//         connectToDatabase();
//         const { questionId } = params;

//         const answers = await Answer.find({ question: questionId })
//             .populate("author", "_id clerkId name picture")
//             .sort({ createdAt: -1 });

//         return { answers };
//     } catch (error) {
//         console.error(`❌ ${error} ❌`);
//         throw error;
//     }
// }
