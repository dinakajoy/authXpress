import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import connectDB from "../src/utils/dbConnect";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.dropCollection("users");
  await mongoose.connection.close();
});

describe("Auth Controller", () => {
  let userId: string;
  const user = {
    name: "Tester",
    email: "test@example.com",
    password: "hashedPass@2025",
  };

  test("POST /register - should create a user and return 201", async () => {
    const response = await request(app).post("/auth/register").send(user);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
  });

  test("POST /login - should return access token on successful login", async () => {
    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });
    userId = response.body.payload._id;

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body).toHaveProperty("payload.token");
    expect(response.body.payload.token).toBeDefined();
  });

  test("POST /login - should return 406 if user is invalid", async () => {
    const response = await request(app).post("/auth/login").send({
      email: user.email,
      password: "wrongpassword",
    });

    expect(response.status).toBe(406);
  });

  test("POST /forgot-password should return a message if user exists", async () => {
    const response = await request(app).post("/auth/forgot-password").send({
      email: user.email,
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password reset email sent.");
  });

  test("GET /logout should logout a user", async () => {
    const response = await request(app).get(`/auth/logout/${userId}`).send();

    expect(response.status).toBe(200);
  });
});
