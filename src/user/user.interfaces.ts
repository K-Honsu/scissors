import { Request } from "express";
import { Document, Schema } from "mongoose"

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    links: Schema.Types.ObjectId[];
    totalHits: number;
    googleId : string,
    IsValidPassword: (password: string) => Promise<boolean>;
}



declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}