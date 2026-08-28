import request from "supertest";
import crypto from "node:crypto";
import app from "../../src/app.js";

export async function createTestUser() {
    const userData = {
        name: "Test User",
        email: `test-${Date.now()}-${crypto.randomUUID()}@gmail.com`,
        password: "123456",
    };

    let signup;
    let login;

    try {
        signup = await request(app)
            .post("/api/auth/signup")
            .send(userData);

        if (signup.status !== 201) {
            throw new Error(
                `Test user signup failed: ${signup.status} ${JSON.stringify(signup.body)}`
            );
        }

        login = await request(app)
            .post("/api/auth/login")
            .send({
                email: userData.email,
                password: userData.password,
            });

        if (login.status !== 200) {
            throw new Error(
                `Test user login failed: ${login.status} ${JSON.stringify(login.body)}`
            );
        }
    } catch (error) {
        throw new Error(`createTestUser failed: ${error.message}`);
    }

    return {
        user: signup.body,
        token: login.body.token,
    };
}
