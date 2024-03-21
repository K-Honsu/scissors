import { createLink, generateQR, getLinks, deleteLink, getHitsConfig } from "./link.controller";
import { BearerToken } from "../auth/auth.controller";
import { linkMiddleware } from "./link.middleware";
import { Router } from "express";

const linkRouter = Router({ mergeParams: true })

// linkRouter.route("/").post(BearerToken, linkMiddleware, createLink).get(BearerToken, getLinks)

linkRouter.post("/create", BearerToken, linkMiddleware, createLink)
linkRouter.get("/links", BearerToken, getLinks)
linkRouter.get("/:alias", BearerToken, generateQR)
linkRouter.get("/status/:id", BearerToken, getHitsConfig)
linkRouter.delete("/:id", BearerToken, deleteLink)

export default linkRouter