import { createClient } from 'redis';
import dotenv from "dotenv"
dotenv.config()

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST ?? "",
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
    }

});

// client.connect()
client.on("ready", async () => {
    console.log("Redis client connected");

})

export default client