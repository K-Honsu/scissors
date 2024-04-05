import { createLink, generateQR, getLinks, deleteLink, getQrCodePath, getHitsConfig, createLinkForUnautheticatedUser } from "./link.controller";
import { BearerToken } from "../auth/auth.controller";
import { linkMiddleware } from "./link.middleware";
import { Router } from "express";

const linkRouter = Router({ mergeParams: true })

// linkRouter.route("/").post(BearerToken, linkMiddleware, createLink).get(BearerToken, getLinks)

linkRouter.post("/anons/create", createLinkForUnautheticatedUser)
linkRouter.post("/create", BearerToken, linkMiddleware, createLink)
linkRouter.post("/:alias", BearerToken, generateQR)
linkRouter.get("/links", BearerToken, getLinks)
linkRouter.get("/qrimage/:alias", BearerToken, getQrCodePath)
linkRouter.get("/status/:id", BearerToken, getHitsConfig)
linkRouter.delete("/:id", BearerToken, deleteLink)

export default linkRouter