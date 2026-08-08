import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js";

describe("Auth Routes", () => {
    beforeEach(async () => {
        if (!process.env.DATABASE_URL?.includes('_test')) {
            throw new Error('Refusing to run tests: DATABASE_URL does not point to a test database.');
        }
        // Clean database before every test
        await prisma.note.deleteMany();
        await prisma.user.deleteMany();
    });

    it("should return welcome message on GET /", async () => {
        const res = await request(app).get("/");

        expect(res.status).to.equal(200);
        expect(res.text).to.equal("Welcome to the backend server");
    });

    it("should signup a new user", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                name: "Test User",
                email: "testuser@gmail.com",
                password: "123456",
            });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("name", "Test User");
        expect(res.body).to.have.property("email", "testuser@gmail.com");
    });

    it("should not signup with duplicate email", async () => {
        const user = {
            name: "Test User",
            email: "duplicate@gmail.com",
            password: "123456",
        };

        await request(app).post("/api/auth/signup").send(user);

        const res = await request(app)
            .post("/api/auth/signup")
            .send(user);

        expect(res.status).to.equal(409);
        expect(res.body).to.have.property(
            "message",
            "Email already registered"
        );
    });

    it("should login successfully", async () => {
        const user = {
            name: "Login User",
            email: "login@gmail.com",
            password: "123456",
        };

        // Signup
        await request(app)
            .post("/api/auth/signup")
            .send(user);

        // Login
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: user.password,
            });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("token");
        expect(res.body.user).to.have.property("id");
        expect(res.body.user).to.have.property("name", user.name);
        expect(res.body.user).to.have.property("email", user.email);
    });

    it("should return 401 for invalid password", async () => {
        const user = {
            name: "Wrong Password User",
            email: "wrong@gmail.com",
            password: "123456",
        };

        await request(app)
            .post("/api/auth/signup")
            .send(user);

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: "654321",
            });

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property(
            "message",
            "Invalid credentials"
        );
    });

    it("should return 401 when token is missing", async () => {
        const res = await request(app).get("/api/auth/me");

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property("message");
    });

    it("should return current user with valid token", async () => {
        const user = {
            name: "Protected User",
            email: "protected@gmail.com",
            password: "123456",
        };

        await request(app)
            .post("/api/auth/signup")
            .send(user);

        const login = await request(app)
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: user.password,
            });

        const token = login.body.token;

        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body.user).to.have.property("email", user.email);
    });

    after(async () => {
        await prisma.$disconnect();
    });
});