"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongoose";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

import {
    AnswerVoteParams,
    CreateAnswerParams,
    DeleteAnswerParams,
    GetAnswersParams,
} from "./shared.types";
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
    try {
        connectToDatabase();

        const { content, author, question, path } = params;

        const answer = await Answer.create({
            content,
            author,
            question,
        });

        // Add the answer to the question answer array
        const questionObj = await Question.findByIdAndUpdate(question, {
            $push: { answers: answer._id },
        });

        // TODO: Add interactions...

        await Interaction.create({
            user: author,
            answer: answer._id,
            type: "answer",
            tags: questionObj?.tags,
        });

        await User.findByIdAndUpdate(author, {
            $inc: { reputation: 10 },
        });

        revalidatePath(path);
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}
export async function getAnswers(params: GetAnswersParams) {
    try {
        connectToDatabase();

        const { questionId, page = 1, pageSize = 5, sortBy } = params;

        // Calculate the number of answers to skip based on the page number and page size
        const skipAmount = (page - 1) * pageSize;

        let sortOptions = {};

        switch (sortBy) {
            case "highestUpvotes":
                sortOptions = { upvotes: -1 };
                break;
            case "lowestUpvotes":
                sortOptions = { upvotes: 1 };
                break;
            case "recent":
                sortOptions = { createdAt: -1 };
                break;
            case "old":
                sortOptions = { createdAt: 1 };
                break;
            default:
                break;
        }

        const answers = await Answer.find({ question: questionId })
            .populate("author", "_id name picture clerkId")
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalAnswers = await Answer.countDocuments({
            question: questionId,
        });

        const isNext = totalAnswers > skipAmount + answers.length;

        return { answers, isNext };
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();

        const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;

        let updateQuery = {};

        if (hasUpvoted) {
            updateQuery = {
                $pull: { upvotes: userId },
            };
        } else if (hasDownvoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $push: { upvotes: userId },
            };
        } else {
            updateQuery = {
                $addToSet: { upvotes: userId },
            };
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
            new: true,
        });

        if (!answer) {
            throw new Error("Answer not found");
        }

        // Increment author's reputation by +1 points because
        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasUpvoted ? -2 : 2 },
        });

        await User.findByIdAndUpdate(answer.author, {
            $inc: { reputation: hasUpvoted ? -10 : 10 },
        });

        revalidatePath(path);
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();

        const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;

        let updateQuery = {};

        if (hasDownvoted) {
            updateQuery = {
                $pull: { downvotes: userId },
            };
        } else if (hasUpvoted) {
            updateQuery = {
                $pull: { upvotes: userId },
                $push: { downvotes: userId },
            };
        } else {
            updateQuery = {
                $addToSet: { downvotes: userId },
            };
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
            new: true,
        });

        if (!answer) {
            throw new Error("Answer not found");
        }

        // Decrement author's reputation by *2 points because
        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasDownvoted ? -2 : 2 },
        });

        await User.findByIdAndUpdate(answer.author, {
            $inc: { reputation: hasDownvoted ? -10 : 10 },
        });

        revalidatePath(path);
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
    try {
        connectToDatabase();

        const { answerId, path } = params;

        // Find the answer
        const answer = await Answer.findById(answerId);

        if (!answer) {
            throw new Error(`❌ Answer not found ❌`);
        }

        // Delete the answer
        await answer.deleteOne({ _id: answerId });

        // Update all question that include the answer
        await Question.updateMany(
            { _id: answer.question },
            { $pull: { answers: answerId } },
        );

        // Delete all interaction relative to the answer
        await Interaction.deleteMany({ answer: answerId });

        revalidatePath(path);
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}
