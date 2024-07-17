import { Schema, models, model, Document, Model, ObjectId } from "mongoose";

export interface ITag extends Document {
    _id: ObjectId;
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

const Tag: Model<ITag> = models?.Tag || model<ITag>("Tag", tagSchema);
export default Tag;
