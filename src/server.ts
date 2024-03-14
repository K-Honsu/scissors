import app from "./main"
import express from "express"
import { connect } from "./config/db"
import http from "http"
import dotenv from "dotenv"
dotenv.config()


const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000
const mongodbUri: any = process.env.MONGODB_URI ?? '';
const server: http.Server = http.createServer(app);



async function createServer() {
    const apps = express()
    apps.use(express.json())
    await connect(mongodbUri)

    server.listen(port, () => console.log(`listening on port: ${port}`))

}


createServer()

export default createServer