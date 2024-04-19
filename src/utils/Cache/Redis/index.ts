import { createClient } from "redis";

const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? ""
const REDIS_HOST = process.env.REDIS_HOST ?? ""
const REDIS_PORT = Number(process.env.REDIS_PORT)

export const client = createClient({
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
})

client.on("ready", async () => {
    console.log("Redis client connected successfully")
})