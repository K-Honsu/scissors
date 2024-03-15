import express, { Request, Response, NextFunction, Application, ErrorRequestHandler } from "express"
import dotenv from "dotenv"
import { globalRateLimiter } from "./utils/rateLimiter/rateLimit"
import geminiRouter from "./utils/AI/gemini.router"
import morgan from "morgan"
import authRouter from "./auth/auth.router"
import cors from "cors"
import linkRouter from "./link/link.router"
import userRouter from "./user/user.router"
import swaggerDocument from "../src/swagger-output.json";
import swaggerUi from "swagger-ui-express";
dotenv.config()

const app = express();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan("tiny"))
app.use(globalRateLimiter)
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

export default app