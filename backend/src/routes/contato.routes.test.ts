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

describe("POST /contatos", () => {
  it("cria contato com sucesso e retorna 201", async (): Promise<void> => {
    const pessoa: Response = await request(app)
      .post("/pessoas")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Ana Souza", cpf: "11144477735" });

    const resposta: Response = await request(app)
      .post("/contatos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        tipo: true,
        descricao: "ana@email.com",
        idPessoa: pessoa.body.id,
      });

    expect(resposta.status).toBe(201);
    expect(resposta.body.descricao).toBe("ana@email.com");
  });

  it("retorna 404 ao criar contato para pessoa inexistente", async (): Promise<void> => {
    const resposta: Response = await request(app)
      .post("/contatos")
      .set("Authorization", `Bearer ${token}`)
      .send({ tipo: true, descricao: "x@email.com", idPessoa: 9999 });

    expect(resposta.status).toBe(404);
  });

  it("retorna 400 quando corpo vem sem idPessoa", async (): Promise<void> => {
    const resposta: Response = await request(app)
      .post("/contatos")
      .set("Authorization", `Bearer ${token}`)
      .send({ tipo: true, descricao: "x@email.com" });

    expect(resposta.status).toBe(400);
  });

  it("retorna 422 ao tentar criar o sexto contato do mesmo tipo", async (): Promise<void> => {
    const pessoa: Response = await request(app)
      .post("/pessoas")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Carlos Lima", cpf: "11144477735" });

    for (let i: number = 0; i < 5; i++) {
      await request(app)
        .post("/contatos")
        .set("Authorization", `Bearer ${token}`)
        .send({
          tipo: true,
          descricao: `email${i}@x.com`,
          idPessoa: pessoa.body.id,
        });
    }

    const resposta: Response = await request(app)
      .post("/contatos")
      .set("Authorization", `Bearer ${token}`)
      .send({ tipo: true, descricao: "sexto@x.com", idPessoa: pessoa.body.id });

    expect(resposta.status).toBe(422);
  });

  it("retorna 401 sem token de autenticação", async (): Promise<void> => {
    const resposta: Response = await request(app)
      .post("/contatos")
      .send({ tipo: true, descricao: "x@email.com", idPessoa: 1 });

    expect(resposta.status).toBe(401);
  });
});

describe("DELETE /pessoas/:id cascade", () => {
  it("remove contatos ao deletar a pessoa dona", async (): Promise<void> => {
    const pessoa: Response = await request(app)
      .post("/pessoas")
      .set("Authorization", `Bearer ${token}`)
      .send({ nome: "Bia Costa", cpf: "11144477735" });

    await request(app)
      .post("/contatos")
      .set("Authorization", `Bearer ${token}`)
      .send({ tipo: true, descricao: "bia@x.com", idPessoa: pessoa.body.id });

    await request(app)
      .delete(`/pessoas/${pessoa.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    const listaContatos: Response = await request(app)
      .get(`/contatos/pessoa/${pessoa.body.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(listaContatos.body).toHaveLength(0);
  });
});
