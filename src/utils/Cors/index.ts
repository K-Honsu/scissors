import { CorsOptions } from "cors"

export const myCorsOptions: CorsOptions = {
    origin: ["*"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true
}