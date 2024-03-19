import { BearerToken } from "../../auth/auth.controller";
import generateResponse from "./gemini.controller"; 
import { Router } from "express";

const geminiRouter = Router({ mergeParams: true })

// userRouter.post("/", userMiddleware, createUser)
geminiRouter.route("/chat").get(BearerToken ,generateResponse)

export default geminiRouter