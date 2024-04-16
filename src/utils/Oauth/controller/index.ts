import Jwt from "jsonwebtoken"
import userModel from "../../../models/user"
import { Request, Response, NextFunction } from "express"

const jwt = process.env.JWT_SECRET ?? ""

export const passportController = {
    async googleLogin(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).send({ error: "User was not authenticated" });
        }
        const { email } = req.user;
        const user: any = await userModel.findOne({ email });
        const token = Jwt.sign(user?.id, jwt);
        return res.status(200).send({ token, data: user });
    },
}