import supertest from "supertest";
import { connect, DatabaseConnection } from "../database";
import userModel from "../models/user";
import app from "../main";


describe("Authentication Test", () => {
  let connection: DatabaseConnection

  beforeAll(async () => {
    connection = await connect();
  });

  afterEach(async () => {
    await connection.cleanup();
  });

  afterAll(async () => {
    await connection.disconnect()
  });

  test("should successfully register a new user", async () => {
    const response = await supertest(app)
      .post("/user")
      .set("content-type", "application/json")
      .send({
        username: "jazzy-don123456",
        email: "mike432@gmail.com",
        password: "iamkingkongmovie"
      })
    expect(response.status).toEqual(201);
  });

  test("should successfully login in a user", async () => {
    await userModel.create({
      username: "daniel_tobi",
      email: "dan@gmail.com",
      password: "passwordispassword"
    })
    const response = await supertest(app)
      .post("/auth")
      .set("content-type", "application/json")
      .send({
        email: "dan@gmail.com",
        password: "passwordispassword"
      })
    expect(response.status).toEqual(200)
    expect(response.body).toMatchObject({
      status: "success",
      token: expect.any(String)
    })
  })
  test("should not successfully login in a user with wrong creditials", async () => {
    await userModel.create({
      username: "daniel_jerry",
      email: "dan@gmail.com",
      password: "passwordispassword"
    })
    const response = await supertest(app)
      .post("/auth")
      .set("content-type", "application/json")
      .send({
        email: "emmanuella@gmail.com",
        password: "learning_node"
      })
    expect(response.status).toEqual(404)
    expect(response.body).toMatchObject({
      message: "User information not found"
    })
  })
});
