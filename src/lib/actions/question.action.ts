"use server";

import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model";
import Tag, { ITag } from "@/database/tag.model";
import Question, { IQuestion } from "@/database/question.model";
import {
    GetQuestionsParams,
    CreateQuestionParams,
    GetQuestionByIdParams,
} from "./shared.types";

export async function createQuestion(params: CreateQuestionParams) {
    try {
        await connectToDatabase();

        const { title, content, tags, author, path } = params;

        // Create question
        const question: IQuestion = new Question({
            title,
            content,
            author,
        });

        const tagDocuments = [];
        for (const tag of tags) {
            const existingTag: ITag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                {
                    $setOnInsert: { name: tag },
                    $push: { question: question._id },
                },
                { upsert: true, new: true },
            );
            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments } },
        });

        // Create an interaction recrod for the user's
        // ask_question action

        // Increment author's reputation by +5 points because
        // he created a question

        revalidatePath(path);
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase();

        /**
         * Search functionality
         */
        const { searchQuery, filter, page = 1, pageSize = 20 } = params;

        // for Pagination => caluclate the number of posts to skip based on the pageNumber and pageSize
        const skipAmount = (page - 1) * pageSize; // caluclate the number of posts to skip based on the pageNumber and pageSize

        /**
         * Query
         */
        const query: FilterQuery<typeof Question> = {};
        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { content: { $regex: new RegExp(searchQuery, "i") } },
            ];
        }

        /**
         * Sorting
         */
        let sortOptions = {};
        switch (filter) {
            case "newest":
                sortOptions = { createdAt: -1 };
                break;

            case "frequent":
                sortOptions = { views: -1 };
                break;

            case "unanswered":
                query.answers = { $size: 0 };
                break;

            default:
                break;
        }

        /**
         * Populating
         */
        const questions = await Question.find(query)
            .populate({
                path: "tags",
                model: Tag,
            })
            .populate({
                path: "author",
                model: User,
            })
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sortOptions);

        /**
         * Pagination
         */
        const totalQuestions = await Question.countDocuments(query);
        const isNext = totalQuestions > skipAmount + questions.length;

        return { questions, isNext };
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        connectToDatabase();

        const { questionId } = params;

        const question = await Question.findById(questionId)
            .populate({
                path: "tags",
                model: Tag,
                select: "_id name",
            })
            .populate({
                path: "author",
                model: User,
                select: "_id clerkId name picture",
            });

        return question;
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}
