import express, { Request, Response, NextFunction, Application, ErrorRequestHandler } from "express"
import {connect} from "./config/db"
import http from "http"
import dotenv from "dotenv"
import userRouter from "./user/user.router"
import authRouter from "./auth/auth.router"
import linkRouter from "./link/link.router"
import geminiRouter from "./utils/AI/gemini.router"
dotenv.config()

const mongodbUri: any = process.env.MONGODB_URI ?? '';

connect(mongodbUri)

const app: Application = express()
const server: http.Server = http.createServer(app);
app.use(express.json())
app.use(express.urlencoded({ extended : true }))

const port: any = process.env.PORT

app.use("/user", userRouter)
app.use("/auth", authRouter)
app.use("/link", linkRouter)
app.use("/gemini", geminiRouter)

app.get('*', (req: Request, res: Response) => {
    return res.status(404).json({
        data: null,
        error: 'route not found'
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
server.listen(port, () => console.log(`listening on port: ${port}`))

