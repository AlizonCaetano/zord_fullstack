import { z } from "zod";

import { validarEmail, validarTelefone } from "@/shared/validadores";
import type { OpcaoSelect } from "@/shared/SelectSimples";

export const tipoContatoSchema = z.enum(["telefone", "email"]);
export type TipoContato = z.infer<typeof tipoContatoSchema>;

export const TIPOS_CONTATO: OpcaoSelect[] = [
  { label: "Telefone", value: "telefone" },
  { label: "E-mail", value: "email" },
];

export function descricaoValidaParaTipo(
  tipo: TipoContato,
  descricao: string,
): boolean {
  return tipo === "email"
    ? validarEmail(descricao)
    : validarTelefone(descricao);
}

function mensagemPorTipo(tipo: TipoContato): string {
  return tipo === "email"
    ? "E-mail inválido."
    : "Telefone inválido. Use DDD + número.";
}

const descricaoSchema = z
  .string()
  .trim()
  .min(1, "Informe o contato.")
  .max(100, "Máximo de 100 caracteres.");

export const contatoFormSchema = z
  .object({
    tipo: tipoContatoSchema,
    descricao: descricaoSchema,
  })
  .superRefine((contato, ctx): void => {
    if (
      contato.descricao !== "" &&
      !descricaoValidaParaTipo(contato.tipo, contato.descricao)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["descricao"],
        message: mensagemPorTipo(contato.tipo),
      });
    }
  });

export type ContatoFormValores = z.infer<typeof contatoFormSchema>;

export const contatoCadastroSchema = z
  .object({
    idPessoa: z.string().min(1, "Selecione a pessoa."),
    tipo: tipoContatoSchema,
    descricao: descricaoSchema,
  })
  .superRefine((contato, ctx): void => {
    if (
      contato.descricao !== "" &&
      !descricaoValidaParaTipo(contato.tipo, contato.descricao)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["descricao"],
        message: mensagemPorTipo(contato.tipo),
      });
    }
  });

export type ContatoCadastroValores = z.infer<typeof contatoCadastroSchema>;
