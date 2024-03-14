// import app from "./main"
const app = require("../src/main")
// import express from "express"
const express = require("express")
// import { connect } from "./config/db"
const { connect } = require("./config/db")
// import http from "http"
const http = require("http")
// import dotenv from "dotenv"
const dotenv = require("dotenv").config()


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

export default createServer