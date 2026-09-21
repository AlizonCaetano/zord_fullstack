import { z } from "zod";

const nomeSchema = z.string().trim().min(1).max(50);
const cpfSchema = z.string().trim().min(1);

const contatoEntradaSchema = z.object({
  tipo: z.boolean(),
  descricao: z.string().trim().min(1).max(100),
});

export const criarPessoaSchema = z.object({
  nome: nomeSchema,
  cpf: cpfSchema,
  contatos: z.array(contatoEntradaSchema).max(10).default([]),
});

export const atualizarPessoaSchema = z.object({
  nome: nomeSchema,
  cpf: cpfSchema,
});
