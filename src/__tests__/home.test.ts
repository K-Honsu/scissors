import supertest from "supertest"
import app from "../main"

describe("Home Route", () => {

    test("should return failure on calling route that does not exist", async () => {
        const response = await supertest(app).get("/undefined").set("content-type", "application/json")
        expect(response.status).toEqual(404)
        expect(response.body).toEqual({
            data: null,
            error: 'route not found'
        })
    }, 10000)
})