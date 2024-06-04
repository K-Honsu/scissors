import { CorsOptions } from "cors"

export const myCorsOptions: CorsOptions = {
    origin: "https://sciss-frontend-lac.vercel.app",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true
}