import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const connect = async (url?: string): Promise<void> => {
    try {
        const databaseUrl = url || process.env.DB_URL
        if (!databaseUrl) throw new Error("Database url is not provided")
        await mongoose.connect(databaseUrl, {} as ConnectOptions);

        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB");
        console.error(error);
    }
};

export { connect, mongoose };
