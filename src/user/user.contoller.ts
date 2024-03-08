import { Request, Response } from "express";
import User from "../models/user";

const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password: userPassword, email } = req.body
        const existingUser = await User.findOne({ email }).exec()
        if (existingUser) {
            return res.status(400).json({
                status: "false",
                message: "User with this email address already exist"
            })
        }
        const user = await User.create({ username, email, password: userPassword })
        const { password, ...others } = user.toObject()
        return res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: others
        })
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            status: "false",
            message: error.message
        })
    }
}

const getAccount = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password")
            .lean()
            .exec();

        if (!user)
            return res.status(404).json({
                status: "error",
                message: "User Account not found",
            });

        return res.status(200).json({
            status: "true",
            message: "User Account retrieved successful",
            data: user,
        });
    } catch (error: any) {
        console.error(error)
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

export { createUser, getAccount }