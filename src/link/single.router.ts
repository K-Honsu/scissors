import { getAliasForLink } from "./single.controller";
import { Router } from "express";

const singleRouter = Router()

singleRouter.get("/:linkalias", getAliasForLink)

export default singleRouter
