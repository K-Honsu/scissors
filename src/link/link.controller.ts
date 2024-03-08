import Link from "../models/link"
import User from "../models/user";
import randomstring from "randomstring"
import { Request, Response } from "express";

const createLink = async (req: Request, res: Response) => {
    try {
        let { url, description, alias } = req.body
        const foundUser = await User.findById({_id : req.user._id})
        if (!foundUser) {
            return res.status(404).json({
                status : false,
                message : "User not found"
            })
        }
        if (!alias) {
            alias = randomstring.generate({
                length: 6,
                charset: "alphabetic",
            })
        }
        // Check to see if link exists
        const linkExists = await Link.findOne({ alias }).exec()
        if (linkExists) return res.status(409).json({
            status : false,
            message : `Sorry, the alias (${alias}) has already been used`
        })
        const link = await Link.create({url, description, alias, createdBy : foundUser._id})
        foundUser.links.push(link.id)
        await foundUser.save()
        return res.status(201).json({
            status : true,
            message : "Link created succesfully",
            data : link
        })
    } catch (error:any) {
        console.error(error)
        return res.status(500).json({
            status : false,
            message : error.message
        })
    }
}

export { createLink }
