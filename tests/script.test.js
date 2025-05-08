// js/script.test.js
const usernameRegex = /^(?=.*[A-Z])(?=.*[!@#$&*~])(?=.*[0-9]).{8,}$/;

describe("Username Validation Regex", () => {
  test("should validate a username with at least 1 capital letter, 1 special character, 1 number, and at least 8 characters", () => {
    expect(usernameRegex.test("Password1!")).toBe(true);
    expect(usernameRegex.test("Valid@123")).toBe(true);
    expect(usernameRegex.test("TestUser#9")).toBe(true);
  });

  test("should invalidate a username with less than 8 characters", () => {
    expect(usernameRegex.test("Pass1!")).toBe(false);
    expect(usernameRegex.test("Short1@")).toBe(false);
  });

  test("should invalidate a username without a capital letter", () => {
    expect(usernameRegex.test("password1!")).toBe(false);
    expect(usernameRegex.test("valid@123")).toBe(false);
  });

  test("should invalidate a username without a special character", () => {
    expect(usernameRegex.test("Password1")).toBe(false);
    expect(usernameRegex.test("Valid1234")).toBe(false);
  });

  test("should invalidate a username without a number", () => {
    expect(usernameRegex.test("Password!")).toBe(false);
    expect(usernameRegex.test("Valid@Name")).toBe(false);
  });
});