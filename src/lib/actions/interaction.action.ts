"use server";

import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";

import Question from "@/database/question.model";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
    try {
        await connectToDatabase();

        const { questionId, userId } = params;

        await Question.findByIdAndUpdate(questionId, {
            $inc: { views: 1 },
        });

        if (userId) {
            const existingInteraction = await Interaction.findOne({
                user: userId,
                question: questionId,
                action: "view",
            });

            if (!existingInteraction) {
                await Interaction.create({
                    user: userId,
                    question: questionId,
                    action: "view",
                });
            }
        }
    } catch (error) {
        console.error(`❌ ${error} ❌`);
        throw error;
    }
}
