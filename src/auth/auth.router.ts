import { Login } from "./auth.controller";
import { Router } from "express";

const authRouter = Router()

authRouter.post("/", Login)

export default authRouter