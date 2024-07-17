import { Schema, models, model, Document, Model, ObjectId } from "mongoose";

export interface IUser extends Document {
    _id: ObjectId;
    clerkId: String;
    name: String;
    username: String;
    email: String;
    password?: String;
    bio?: String;
    picture: String;
    location?: String;
    portfolioWebsite?: String;
    reputation?: Number;
    saved: Schema.Types.ObjectId[];
    joinedAt: Date;
}

const UserSchema = new Schema<IUser>({
    clerkId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    bio: {
        type: String,
    },
    picture: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    portfolioWebsite: {
        type: String,
    },
    reputation: {
        type: Number,
        default: 0,
    },
    saved: [
        {
            type: Schema.Types.ObjectId,
            ref: "Question",
        },
    ],
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

const User: Model<IUser> = models?.User || model<IUser>("User", UserSchema);
export default User;
