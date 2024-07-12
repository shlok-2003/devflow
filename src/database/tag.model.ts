import { Schema, models, model, Document } from "mongoose";

export interface ITag extends Document {
    name: string;
    description: string;
    questions: Schema.Types.ObjectId[];
    followers: Schema.Types.ObjectId[];
    createdOn: Date;
}

const tagSchema = new Schema<ITag>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    questions: [
        {
            type: Schema.Types.ObjectId,
            ref: "Question",
        },
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

const Tag = models.Tag || model<ITag>("Tag", tagSchema);
export default Tag;
