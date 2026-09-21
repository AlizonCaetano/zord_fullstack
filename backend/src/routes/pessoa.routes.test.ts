import request from "supertest";
import express, { Express } from "express";
import { Response } from "supertest";
import { AppDataSource } from "../data-source";
import { router } from "./index";

let app: Express;
let token: string;

beforeAll(async (): Promise<void> => {
  await AppDataSource.initialize();
  app = express();
  app.use(express.json());
  app.use(router);

  const login: Response = await request(app)
    .post("/auth/login")
    .send({ usuario: process.env.AUTH_USER, senha: process.env.AUTH_PASS });

  token = login.body.token;
});

beforeEach(async (): Promise<void> => {
  await AppDataSource.query("TRUNCATE pessoa CASCADE");
});

afterAll(async (): Promise<void> => {
  await AppDataSource.destroy();
});

describe("POST /pessoas", () => {
  it("cria pessoa com sucesso e retorna 201", async (): Promise<void> => {
    const resposta: Response = await request(app)
      .post("/pessoas")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Carlos Souza", cpf: "11144477735" });

    expect(resposta.status).toBe(201);
    expect(resposta.body.nome).toBe("Carlos Souza");
  });

  it("retorna 422 com CPF inválido", async (): Promise<void> => {
    const resposta: Response = await request(app)
      .post("/pessoas")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Carlos Souza", cpf: "11111111111" });

    expect(resposta.status).toBe(422);
  });

  it("retorna 409 ao criar CPF duplicado", async (): Promise<void> => {
    await request(app)
      .post("/pessoas")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Pessoa A", cpf: "52998224725" });

    const resposta: Response = await request(app)
      .post("/pessoas")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Pessoa B", cpf: "52998224725" });

    expect(resposta.status).toBe(409);
  });

  it("retorna 422 quando corpo da requisição vem sem cpf", async (): Promise<void> => {
    const resposta: Response = await request(app)
      .post("/pessoas")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Sem CPF" });

    expect(resposta.status).toBe(400);
  });

  it("retorna 401 sem token de autenticação", async (): Promise<void> => {
    const resposta: Response = await request(app)
      .post("/pessoas")
      .send({ nome: "Sem Token", cpf: "11144477735" });

    expect(resposta.status).toBe(401);
  });
});

describe("PUT /pessoas/:id", () => {
  it("retorna 400 ao atualizar pessoa com corpo sem cpf", async (): Promise<void> => {
    const criada: Response = await request(app)
      .post("/pessoas")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Pedro Alves", cpf: "11144477735" });

    const resposta: Response = await request(app)
      .put(`/pessoas/${criada.body.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Pedro Novo" });

    expect(resposta.status).toBe(400);
  });
});
