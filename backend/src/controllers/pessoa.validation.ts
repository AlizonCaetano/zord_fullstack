import { z } from "zod";

const nomeSchema = z.string();
const cpfSchema = z.string();

export const criarPessoaSchema = z.object({
  nome: nomeSchema,
  cpf: cpfSchema,
});

export const atualizarPessoaSchema = z.object({
  nome: nomeSchema,
  cpf: cpfSchema,
});
