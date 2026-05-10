const { greet } = require("../src/script.js");

test("greet returns a hello message with the given name", () => {
  expect(greet("World")).toBe("Hello, World!");
});

test("greet works for GitHub Actions", () => {
  expect(greet("GitHub Actions")).toBe("Hello, GitHub Actions!");
});
