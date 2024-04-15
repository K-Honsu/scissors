import { BearerToken } from "../../auth/auth.controller";
import generateResponse from "./gemini.controller"; 
import { Router } from "express";

const geminiRouter = Router({ mergeParams: true })

// userRouter.post("/", userMiddleware, createUser)
geminiRouter.route("/chat").post(BearerToken ,generateResponse)

export default geminiRouter