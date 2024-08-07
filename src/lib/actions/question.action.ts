"use server";

import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/mongoose";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";
import Interaction from "@/database/interaction.model";
import Question from "@/database/question.model";

import {
    GetQuestionsParams,
    CreateQuestionParams,
    GetQuestionByIdParams,
    QuestionVoteParams,
    DeleteQuestionParams,
    EditQuestionParams,
    RecommendedParams,
} from "./shared.types";

export async function createQuestion(params: CreateQuestionParams) {
    try {
        await connectToDatabase();

        const { title, content, tags, author, path } = params;

        // Create question
        const question = await Question.create({
            title,
            content,
            author,
        });

        const tagDocuments = [];
        for (const tag of tags) {
            const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters

            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${escapedTag}$`, "i") } }, // find something
                {
                    $setOnInsert: { name: tag },
                    $push: { questions: question._id },
                }, // do something on it
                { upsert: true, new: true }, // additional options
            );
            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments } },
        });

        // Create an interaction record for the user's
        // ask_question action
        await Interaction.create({
            user: author,
            action: "ask_question",
            question: question._id,
            tags: tagDocuments,
        });

        // Increment author's reputation by +5 points because
        // he created a question
        await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

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

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

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

        const question = await Question.findByIdAndUpdate(
            questionId,
            updateQuery,
            { new: true },
        );

        if (!question) {
            throw new Error("Question not found");
        }

        // Increment author's reputation by +1 points because
        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasUpvoted ? -1 : 1 },
        });

        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasUpvoted ? -10 : 10 },
        });

        revalidatePath(path);
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

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

        const question = await Question.findByIdAndUpdate(
            questionId,
            updateQuery,
            { new: true },
        );

        if (!question) {
            throw new Error("Question not found");
        }

        // Decrement author's reputation by *2 points because
        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasDownvoted ? -2 : 2 },
        });

        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasDownvoted ? -10 : 10 },
        });

        revalidatePath(path);
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        connectToDatabase();

        const { questionId, path } = params;

        // Delete the question
        await Question.deleteOne({ _id: questionId });

        // Delete all answers relative to the question
        await Answer.deleteMany({ question: questionId });

        // Delete all interaction relative to the question
        await Interaction.deleteMany({ question: questionId });

        // Update all tags that include the question
        await Tag.updateMany(
            { questions: questionId },
            { $pull: { questions: questionId } },
        );

        revalidatePath(path);
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function editQuestion(params: EditQuestionParams) {
    try {
        connectToDatabase();

        const { questionId, title, content, path } = params;

        const question = await Question.findById(questionId).populate("tags");

        if (!question) {
            throw new Error("❌🔍 Question not found 🔍❌");
        }

        question.title = title;
        question.content = content;

        await question.save();

        revalidatePath(path);
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function getHotQuestions() {
    try {
        connectToDatabase();

        const hotQuestions = await Question.find({})
            .sort({ views: -1, upvotes: -1 })
            .limit(5);

        return hotQuestions;
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
    try {
        await connectToDatabase();

        const { userId, page = 1, pageSize = 20, searchQuery } = params;

        // find user
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            throw new Error("user not found");
        }

        const skipAmount = (page - 1) * pageSize;

        // Find the user's interactions
        const userInteractions = await Interaction.find({ user: user._id })
            .populate("tags")
            .exec();

        // Extract tags from user's interactions
        const userTags = userInteractions.reduce((tags, interaction) => {
            if (interaction.tags) {
                tags = tags.concat(interaction.tags as never[]);
            }
            return tags;
        }, []);

        // Get distinct tag IDs from user's interactions
        const distinctUserTagIds = [
            // @ts-ignore
            ...new Set(userTags.map((tag: any) => tag._id)),
        ];

        const query: FilterQuery<typeof Question> = {
            $and: [
                { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
                { author: { $ne: user._id } }, // Exclude user's own questions
            ],
        };

        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } },
            ];
        }

        const totalQuestions = await Question.countDocuments(query);

        const recommendedQuestions = await Question.find(query)
            .populate({
                path: "tags",
                model: Tag,
            })
            .populate({
                path: "author",
                model: User,
            })
            .skip(skipAmount)
            .limit(pageSize);

        const isNext =
            totalQuestions > skipAmount + recommendedQuestions.length;

        return { questions: recommendedQuestions, isNext };
    } catch (error) {
        console.error("Error getting recommended questions:", error);
        throw error;
    }
}
