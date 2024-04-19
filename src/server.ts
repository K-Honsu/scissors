import app from "./main"
import express from "express"
import { connect } from "./config/db"
import "./utils/Oauth/passport"
import http from "http"
import { client } from "./utils/Cache/Redis/index"
import dotenv from "dotenv"
dotenv.config()


const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
const mongodbUri = process.env.MONGODB_URI ?? '';
const server = http.createServer(app);



async function createServer() {
    const apps = express()
    apps.use(express.json())
    await connect(mongodbUri)

    server.listen(port, () => console.log(`listening on port: ${port}`))

}


createServer()
client.connect()

export default createServer