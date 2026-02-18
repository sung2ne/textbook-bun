// examples/migration/app.js - 기존 Express CJS 앱 (전략 1: 그대로 실행하기)
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/users/:id", (req, res) => {
  res.json({ userId: req.params.id });
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({ id: 1, name, email });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
