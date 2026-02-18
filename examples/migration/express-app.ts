// examples/migration/express-app.ts - 마이그레이션 전: Express 방식
import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello!" });
});

app.get("/users/:id", (req, res) => {
  res.json({ userId: req.params.id });
});

app.post("/users", (req, res) => {
  res.status(201).json(req.body);
});

app.listen(3000);
