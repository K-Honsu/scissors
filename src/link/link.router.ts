import { createLink } from "./link.controller";
import { BearerToken } from "../auth/auth.controller";
import { Router } from "express";

const linkRouter = Router()

linkRouter.post("/", BearerToken, createLink)

export default linkRouter