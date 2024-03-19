import { createLink, generateQR, getLinks, getAliasForLink, deleteLink } from "./link.controller";
import { BearerToken } from "../auth/auth.controller";
import { linkMiddleware } from "./link.middleware";
import { Router } from "express";

const linkRouter = Router({ mergeParams: true })

linkRouter.route("/").post(BearerToken, linkMiddleware, createLink).get(BearerToken, getLinks)

linkRouter.get("/:alias", BearerToken, generateQR)
linkRouter.get("/:linkalias", getAliasForLink)
linkRouter.delete("/:id", BearerToken, deleteLink)

export default linkRouter