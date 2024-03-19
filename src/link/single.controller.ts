import linkModel from "../models/link";
import e, { Request, Response } from "express";

export const getAliasForLink = async (req: Request, res: Response) => {
    try {
        const { linkalias } = req.params
        const existingLink = await linkModel.findOne({ alias: linkalias }).exec()
        if (!existingLink) return res.status(404).json({
            status: false,
            message: "Link alias not found"
        })
        return res.redirect(existingLink.url)
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}