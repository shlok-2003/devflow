import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
    mongoose.set("strictQuery", true);

    if (!process.env.MONGODB_URL) {
        throw new Error("MongoDB URI is missing");
    }

    if (isConnected) {
        return console.log("Using existing database connection");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            dbName: "devflow",
        });

        isConnected = true;
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error connecting to database", error);
    }
};
