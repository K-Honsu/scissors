import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: any; // Define the user property on the request object
        }
    }
}

export {};