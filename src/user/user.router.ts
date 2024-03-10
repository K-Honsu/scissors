import { userMiddleware } from "./user.middleware";
import { createUser, getAccount } from "./user.contoller";
import { Router } from "express";

const userRouter = Router({ mergeParams: true })

// userRouter.post("/", userMiddleware, createUser)
userRouter.route("/").post(userMiddleware, createUser).get(getAccount)

export default userRouter