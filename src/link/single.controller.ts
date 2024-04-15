import linkModel from "../models/link";
import e, { Request, Response } from "express";

export const getAliasForLink = async (req: Request, res: Response) => {
    try {
        const { linkalias } = req.params
        const existingLink:any = await linkModel.findOne({ alias: linkalias }).exec()
        if (!existingLink) return res.status(404).json({
            status: false,
            message: "Link alias not found"
        })
        console.log({ "existingLink": req.headers })
        existingLink.hits.push({
            type: "click",
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            // referrer: req.get('Referrer'),
            userAgent: req.headers["user-agent"],
        })
        await existingLink.save()
        return res.redirect(existingLink.url)
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            status: false,
            message: error.message
        })
    }
}