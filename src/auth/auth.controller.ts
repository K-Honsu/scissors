import User from "../models/user"
import { Response, Request, NextFunction } from "express"
import Jwt from "jsonwebtoken"
import "./auth.interfaces"
import dotenv from "dotenv"
dotenv.config()

const jwt_token: any = process.env.JWT_SECRET

const Login = async (req: Request, res: Response) => {
    try {
        const { email, password:userPassword } = req.body

        const user = await User.findOne({ email: email })
        if (!user) return res.status(404).json({
            status: "Error",
            message: "User information not found"
        })
        const validPassword = await user.IsValidPassword(userPassword)
        if (!validPassword) return res.status(400).json({
            status: "Error",
            message: "Email or password is incorrect"
        })
        const token = Jwt.sign({ email: user.email, _id: user._id }, jwt_token, { expiresIn: "1hr" })
        const {password, ...data} = user.toObject()
        return res.status(200).json({
            status: "success",
            message: "Logged in successfully",
            data,
            token
        })
    } catch (error: any) {
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const BearerToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const headers: any = req.headers
        if (!headers) {
            return res.status(400).json({
                status: "error",
                data: "You are not authorized"
            })
        }
        const token = headers.authorization.split(" ")[1]
        const decoded = Jwt.verify(token, jwt_token) as { _id: string };
        const user = await User.findOne({ _id: decoded._id })
        if (!user) {
            return res.status(400).json({
                status: "error",
                data: "You are not authorized"
            })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            data: "Unauthorized"
        })
    }
}

export { Login, BearerToken }