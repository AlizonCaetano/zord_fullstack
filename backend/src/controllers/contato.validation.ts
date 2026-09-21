import { z } from "zod";

const descricaoSchema = z.string().trim().min(1).max(100);

export const criarContatoSchema = z.object({
  idPessoa: z.number().int().positive(),
  tipo: z.boolean(),
  descricao: descricaoSchema,
});

export const atualizarContatoSchema = z.object({
  descricao: descricaoSchema,
});
