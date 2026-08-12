import request from "supertest";
import { expect } from "chai";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js";
import { createTestUser } from "./helpers/auth.js";

describe("Note Routes", () => {
    let token;
    let user;

    beforeEach(async () => {
        const dbName = new URL(process.env.DATABASE_URL)
            .pathname
            .replace("/", "");

        if (!dbName.endsWith("_test")) {
            throw new Error(
                "Refusing to run tests: DATABASE_URL does not point to a test database."
            );
        }

        await prisma.blacklistedToken.deleteMany();
        await prisma.note.deleteMany();
        await prisma.user.deleteMany();

        const auth = await createTestUser();
        user = auth.user;
        token = auth.token;
    });

    // CREATE
    it("should create a new note", async () => {
        const res = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "My First Note", content: "This is my first note" });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("id");
        expect(res.body).to.have.property("userId", user.id);
        expect(res.body).to.have.property("title", "My First Note");
        expect(res.body).to.have.property("content", "This is my first note");
    });

    it("should return 400 when title is missing", async () => {
        const res = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ content: "This note has no title" });

        expect(res.status).to.equal(400);
        expect(res.body).to.have.property("message", "Title is required");
    });

    it("should return 401 when token is missing on create", async () => {
        const res = await request(app)
            .post("/api/notes")
            .send({ title: "My Note", content: "Content" });

        expect(res.status).to.equal(401);
        expect(res.body).to.have.property("message");
    });

    // GET ALL 
    it("should return only the logged-in user's notes", async () => {
        await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Note 1", content: "Content 1" });

        await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Note 2", content: "Content 2" });

        const otherAuth = await createTestUser({ email: `other${Date.now()}@gmail.com` });
        await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${otherAuth.token}`)
            .send({ title: "Other User Note", content: "Should not appear" });

        const res = await request(app)
            .get("/api/notes")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf(2);
        res.body.forEach((note) => {
            expect(note.userId).to.equal(user.id);
        });
    });

    it("should return empty array when user has no notes", async () => {
        const res = await request(app)
            .get("/api/notes")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array").that.is.empty;
    });

    // GET ONE
    it("should get a single note by id", async () => {
        const createRes = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Solo Note", content: "Solo content" });

        const noteId = createRes.body.id;

        const res = await request(app)
            .get(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("id", noteId);
        expect(res.body).to.have.property("title", "Solo Note");
    });

    it("should return 404 when note does not exist", async () => {
        const res = await request(app)
            .get("/api/notes/99999")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(404);
        expect(res.body).to.have.property("message", "Note not found");
    });

    it("should return 403 when accessing another user's note", async () => {
        const createRes = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Private Note", content: "Only mine" });

        const noteId = createRes.body.id;

        const otherAuth = await createTestUser({ email: `intruder${Date.now()}@gmail.com` });

        const res = await request(app)
            .get(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${otherAuth.token}`);

        expect(res.status).to.equal(403);
        expect(res.body).to.have.property("message", "Not authorized to access this note");
    });

    // UPDATE 
       it("should update own note", async () => {
        const createRes = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Old Title", content: "Old Content" });

        const noteId = createRes.body.id;

        const res = await request(app)
            .put(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "New Title", content: "New Content" });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("title", "New Title");
        expect(res.body).to.have.property("content", "New Content");
    });

    it("should return 403 when updating another user's note", async () => {
        const createRes = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Original", content: "Original Content" });

        const noteId = createRes.body.id;

        const otherAuth = await createTestUser({ email: `hacker${Date.now()}@gmail.com` });

        const res = await request(app)
            .put(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${otherAuth.token}`)
            .send({ title: "Hacked", content: "Hacked Content" });

        expect(res.status).to.equal(403);
    });

    //  DELETE 
    it("should delete own note", async () => {
        const createRes = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "To Delete", content: "Bye" });

        const noteId = createRes.body.id;

        const res = await request(app)
            .delete(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property("message", "Note deleted successfully");

        const checkRes = await request(app)
            .get(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(checkRes.status).to.equal(404);
    });

    it("should return 403 when deleting another user's note", async () => {
        const createRes = await request(app)
            .post("/api/notes")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Protected", content: "Do not delete" });

        const noteId = createRes.body.id;

        const otherAuth = await createTestUser({ email: `sneaky${Date.now()}@gmail.com` });

        const res = await request(app)
            .delete(`/api/notes/${noteId}`)
            .set("Authorization", `Bearer ${otherAuth.token}`);

        expect(res.status).to.equal(403);
    });

    after(async () => {
        await prisma.$disconnect();
    });
});