import express, { Request, Response, NextFunction, Application, ErrorRequestHandler } from "express"
import {connect} from "./config/db"
import dotenv from "dotenv"
import userRouter from "./user/user.router"
import authRouter from "./auth/auth.router"
import linkRouter from "./link/link.router"
dotenv.config()

const mongodbUri: any = process.env.MONGODB_URI ?? '';

connect(mongodbUri)

const app: Application = express()
app.use(express.json())

const port: any = process.env.PORT

app.use("/user", userRouter)
app.use("/auth", authRouter)
app.use("/link", linkRouter)

app.get('*', (req: Request, res: Response) => {
    return res.status(404).json({
        data: null,
        error: 'route not found'
    })
})
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello, node application working well")
    return res.status(200).json({
        data: "found",
        error: 'found'
    })
})
const ErrorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(err.status || 500).send({
        message: "An error occured. Oops!",
        error: err.message,
    });
}

app.use(ErrorHandler)
app.listen(port, () => console.log(`listening on port: ${port}`))

