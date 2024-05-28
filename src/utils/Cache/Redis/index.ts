// import { createClient } from "redis";

// const REDIS_PASSWORD = process.env.REDIS_PASSWORD ?? ""
// const REDIS_HOST = process.env.REDIS_HOST ?? ""
// const REDIS_PORT = Number(process.env.REDIS_PORT)

// export const client = createClient({
//     password: REDIS_PASSWORD,
//     socket: {
//         host: REDIS_HOST,
//         port: REDIS_PORT
//     }
// })

// client.on("ready", async () => {
//     console.log("Redis client connected successfully")
// })

import NodeCache from "node-cache"

export class MyCache {
    private newCache = new NodeCache()

    async setKey(key: string, val: any, ttl?: any) {
        const data = await this.newCache.set(key, val, ttl)
        return data
    }

    // @ts-ignore
    async getKey(val: any) {
        const retreivedData = await this.newCache.get(val)
        if (retreivedData === undefined) {
            return null
        } else {
            return retreivedData
        }
    }

    async delKey(val: string) {
        const deletedData = await this.newCache.del(val)
        return "Data deleted successfully"
    }
}