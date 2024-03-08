import { userMiddleware } from "./user.middleware";
import { createUser } from "./user.contoller";
import { Router } from "express";

const userRouter = Router()

userRouter.post("/", userMiddleware, createUser)

export default userRouter