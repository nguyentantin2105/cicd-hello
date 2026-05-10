function greet(name) {
  return `Hello, ${name}!`;
}

if (typeof document !== "undefined") {
  document.getElementById("greeting").textContent = greet("GitHub Actions");
}

if (typeof module !== "undefined") {
  module.exports = { greet };
}
