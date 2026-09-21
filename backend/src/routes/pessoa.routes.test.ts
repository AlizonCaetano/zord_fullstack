import request from "supertest";
import express, { Express } from "express";
import { AppDataSource } from "../data-source";
import { router } from "./index";

let app: Express;

beforeAll(async () => {
  await AppDataSource.initialize();
  app = express();
  app.use(express.json());
  app.use(router);
});

beforeEach(async () => {
  await AppDataSource.query("TRUNCATE pessoa CASCADE");
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("POST /pessoas", () => {
  it("cria pessoa com sucesso e retorna 201", async () => {
    const resposta = await request(app)
      .post("/pessoas")
      .send({ nome: "Carlos Souza", cpf: "11144477735" });

    expect(resposta.status).toBe(201);
    expect(resposta.body.nome).toBe("Carlos Souza");
  });

  it("retorna 422 com CPF inválido", async () => {
    const resposta = await request(app)
      .post("/pessoas")
      .send({ nome: "Carlos Souza", cpf: "11111111111" });

    expect(resposta.status).toBe(422);
  });

  it("retorna 409 ao criar CPF duplicado", async () => {
    await request(app)
      .post("/pessoas")
      .send({ nome: "Pessoa A", cpf: "52998224725" });

    const resposta = await request(app)
      .post("/pessoas")
      .send({ nome: "Pessoa B", cpf: "52998224725" });

    expect(resposta.status).toBe(409);
  });

  it("retorna 422 quando corpo da requisição vem sem cpf", async () => {
    const resposta = await request(app)
      .post("/pessoas")
      .send({ nome: "Sem CPF" });

    expect(resposta.status).toBe(400);
  });
});
