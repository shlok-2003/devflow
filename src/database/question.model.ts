import { Schema, models, model, Document, Model, ObjectId } from "mongoose";

export interface IQuestion extends Document {
    _id: ObjectId;
    title: string;
    content: string;
    tags: Schema.Types.ObjectId[];
    views: number;
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    author: Schema.Types.ObjectId;
    answers: Schema.Types.ObjectId[];
    createdAt: Date;
}

const questionSchema = new Schema<IQuestion>({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tag",
        },
    ],
    views: {
        type: Number,
        default: 0,
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
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: "Answer",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Question: Model<IQuestion> =
    models?.Question || model<IQuestion>("Question", questionSchema);
export default Question;
