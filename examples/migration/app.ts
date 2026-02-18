// examples/migration/app.ts - Express TypeScript 앱 (전략 2: TypeScript로 전환하기)
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

interface User {
  id: number;
  name: string;
  email: string;
}

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express with TypeScript!" });
});

app.get("/users/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  res.json({ userId });
});

app.post("/users", (req: Request, res: Response) => {
  const { name, email } = req.body as { name: string; email: string };
  const user: User = { id: 1, name, email };
  res.status(201).json(user);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
