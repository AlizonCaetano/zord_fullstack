import { z } from "zod";

const tipoSchema = z.boolean();
const descricaoSchema = z.string();
const idPessoaSchema = z.number();

export const criarContatoSchema = z.object({
  tipo: tipoSchema,
  descricao: descricaoSchema,
  idPessoa: idPessoaSchema,
});

export const atualizarContatoSchema = z.object({
  descricao: descricaoSchema,
});
