import supertest from "supertest";
import { connect, DatabaseConnection } from "../database";
import userModel from "../models/user";
import linkModel from "../models/link";
import client from "../utils/Cache/redis";
import app from "../main";


describe("Link Test", () => {
    let connection: DatabaseConnection
    let token: String
    let _id: String

    beforeAll(async () => {
        connection = await connect();
    });

    beforeEach(async () => {
        await client.connect()
        const user = await userModel.create({
            username: "feragambo1",
            email: "feranmia511@gmail.com",
            password: "passwordispassword"
        })
        const response = await supertest(app)
            .post("/auth")
            .set("content-type", "application/json")
            .send({
                email: "feranmia511@gmail.com",
                password: "passwordispassword"
            })
        console.log(_id)
        token = response.body.token
        _id = response.body.data._id

        // creating link
        const blog = await linkModel.create({
            url: "https://github.com/prettyirrelevant/giveawayy/blob/dev/payments/services.py",
            description: "dont forget to ckean the house",
            alias: "https://idontknow.com",
            createdBy: _id
        })
        const res = await supertest(app)
            .post("/link")
            .set("authorization", `Bearer ${token}`)
            .set("content-type", "application/json")
            .send({
                "url": "https://github.com/prettyirrelevant/giveawayy/blob/prod/payments/services.py",
                "description": "shorten links",
                "alias": "https://mynew-baba.com"
            })
        // url = res.body.data.url
        // id = res.body.data._id
    })

    afterEach(async () => {
        await connection.cleanup();
        await client.quit()
    }, 50000);

    afterAll(async () => {
        await connection.disconnect()
    });

    test("it should create a link for a successfully logged in user", async () => {
        const response = await supertest(app)
            .post("/link")
            .set("content-type", "application/json")
            .set("authorization", `Bearer ${token}`)
            .send({
                "url": "https://github.com/prettyirrelevant/giveawayy/blob/dev/payments/services.py",
                "description": "shorten links",
                "alias": "https://mynewbadman.com"
            })
        expect(response.status).toEqual(201)
        expect(response.body).toMatchObject({
            data: expect.any(Object)
        })
    }, 5000)

    test("it should get all the link for a successfully logged in user", async () => {
        const response = await supertest(app)
            .get("/link")
            .set("content-type", "application/json")
            .set("authorization", `Bearer ${token}`)

        expect(response.status).toEqual(200)
        expect(response.body).toMatchObject({
            data: expect.any(Array)
        })
    }, 50000)
})