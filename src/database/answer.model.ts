import { Schema, models, model, Document } from "mongoose";

export interface IAnswer extends Document {
    author: Schema.Types.ObjectId;
    content: string;
    question: Schema.Types.ObjectId;
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    upvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    downvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);
export default Answer;