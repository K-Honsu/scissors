import { NextFunction, Request, Response } from "express"
import Validator from "validatorjs"

const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const rules = {
            username: "required|min:6|max:60",
            password: 'required|string|min:8',
            email: 'required|email',
        }
        let validation = new Validator(data, rules)
        if (!validation.passes()) {
            return res.status(422).json({
                message: validation.errors.errors,
                status: false
            })
        }
        next()
    } catch (error: any) {
        return res.status(422).json({
            success: false,
            message: error.message
        })
    }
}

export { userMiddleware }