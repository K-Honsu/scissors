import { NextFunction, Request, Response } from "express"
import Validator from "validatorjs"

const linkMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const rules = {
            url: "required|min:6",
            description: 'required|string|min:4',
            alias: 'required|min:6|max:6',
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

export { linkMiddleware }