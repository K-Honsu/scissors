import { createLink, generateQR, getLinks } from "./link.controller";
import { BearerToken } from "../auth/auth.controller";
import { Router } from "express";

const linkRouter = Router({ mergeParams: true })

// linkRouter.use(BearerToken)

linkRouter.route("/").post(BearerToken, createLink).get(BearerToken, getLinks)

linkRouter.get("/:alias", BearerToken, generateQR)
// linkRouter.post("/", BearerToken, createLink)

export default linkRouter