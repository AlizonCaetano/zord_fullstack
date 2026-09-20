import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";

const app = express();
app.use(express.json());

app.get("/health", (req: Request, res: Response): void => {
  res.json({ status: "ok" });
});

const PORT: number = Number(process.env.PORT) || 3000;

async function bootstrap(): Promise<void> {
  await AppDataSource.initialize();
  console.log("Conectado ao banco");

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

bootstrap().catch((err: Error) => {
  console.error("Erro ao conectar no banco", err.message);
});
