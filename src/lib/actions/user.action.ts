"use server";

import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongoose";
import User, { IUser } from "@/database/user.model";
import Question from "@/database/question.model";
import {
    CreateUserParams,
    GetUserByIdParams,
    UpdateUserParams,
    DeleteUserParams,
    GetAllUsersParams,
} from "@/lib/actions/shared.types";

export async function getUserById(params: GetUserByIdParams) {
    try {
        await connectToDatabase();

        const { userId } = params;
        const user: IUser | null = await User.findOne({ clerkId: userId });

        return user;
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function createUser(params: CreateUserParams) {
    try {
        connectToDatabase();

        const newUser: IUser = await User.create(params);

        return newUser;
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        connectToDatabase();

        const { clerkId, updateData, path } = params;

        await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

        revalidatePath(path);
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        connectToDatabase();

        const { clerkId } = params;
        const user: IUser | null = await User.findOneAndDelete({ clerkId });

        if (!user) {
            throw new Error("❌🔍 User not found 🔍❌");
        }

        /**
         *  Delete user from database
         *  It means questions, answers, commnets, etc
         *
         */
        // get user question ids

        // ?  const userQuestionIds = await Question.find({
        // ?    author: user._id
        // ?  }).distinct('_id');

        // ⬆️ distinct | create a distinct query, meaning return
        // distinct values of the given field that mathces this filter

        // delete user questions
        await Question.deleteMany({ author: user._id });

        // TODO: delete user answers, comments, etc

        // delete user
        const deletedUser: IUser | null = await User.findByIdAndDelete(
            user._id,
        );

        return deletedUser;
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase();

        const { searchQuery, filter, page = 1, pageSize = 10 } = params;

        // for Pagination => caluclate the number of posts to skip
        // based on the pageNumber and pageSize
        const skipAmount = (page - 1) * pageSize;

        /**
         * Query
         */
        const query: FilterQuery<typeof User> = {};
        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { username: { $regex: new RegExp(searchQuery, "i") } },
            ];
        }

        /**
         * Filter
         */
        let sortOption = {};
        switch (filter) {
            case "new_users":
                sortOption = { joinedAt: -1 };
                break;

            case "old_users":
                sortOption = { joinedAt: 1 };
                break;

            case "top_contributors":
                sortOption = { reputation: -1 };
                break;

            default:
                break;
        }

        const users: IUser[] = await User.find(query)
            .sort(sortOption)
            .skip(skipAmount)
            .limit(pageSize);

        /**
         * Pagination
         */
        const totalUsers = await User.countDocuments(query);
        const isNext = totalUsers > skipAmount + users.length;

        return { users, isNext };
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}
