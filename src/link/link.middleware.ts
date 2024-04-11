import { NextFunction, Request, Response } from "express"
import { getAliasForLink } from "./single.controller"
import Validator from "validatorjs"

const linkMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body
        const rules = {
            url: "required|min:6",
            description: 'required|string|min:4'
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
            status: false,
            message: error.message
        })
    }
}

// export const redirectMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { host, originalUrl } = req.headers;
//         const isClutterlyURL =
//             host === "clutter.ly" || host === "www.clutter.ly";
//         if (isClutterlyURL && typeof originalUrl === 'string') {
//             const linkAlias = originalUrl.split("/").pop();
//             // @ts-ignore
//             req.params.linkalias = linkAlias;
//         }
//         next();
//     } catch (error: any) {
//         return res.status(500).json({
//             status: false,
//             message: error.message
//         })
//     }
// }

export { linkMiddleware }