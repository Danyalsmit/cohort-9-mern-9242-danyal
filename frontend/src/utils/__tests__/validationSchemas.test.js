import { describe, it, expect } from "@jest/globals";
import { loginSchema, signupSchema } from "../validationSchemas";

describe("loginSchema", () => {
  it("passes with valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("fails with invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("fails with empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  it("passes with valid name, email, and password", () => {
    const result = signupSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("fails when name is too short", () => {
    const result = signupSchema.safeParse({
      name: "T",
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("fails when password is shorter than 6 characters", () => {
    const result = signupSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "123",
    });
    expect(result.success).toBe(false);
  });

  it("fails with invalid email format", () => {
    const result = signupSchema.safeParse({
      name: "Test User",
      email: "invalid-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });
});