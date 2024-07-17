import { Schema, models, model, Document, Model, ObjectId } from "mongoose";

export interface IInteraction extends Document {
    _id: ObjectId;
    user: Schema.Types.ObjectId;
    action: string;
    question: Schema.Types.ObjectId;
    answer: Schema.Types.ObjectId;
    tags: Schema.Types.ObjectId[];
    createdAt: Date;
}

const InteractionSchema = new Schema<IInteraction>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
    },
    answer: {
        type: Schema.Types.ObjectId,
        ref: "Answer",
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tag",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Interaction: Model<IInteraction> =
    models?.Interaction ||
    model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
