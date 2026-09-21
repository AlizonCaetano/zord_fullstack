import { z } from "zod";

import {
  validarCpf,
  validarEmail,
  validarNome,
  validarTelefone,
} from "@/shared/validadores";

export const LIMITE_CONTATOS_POR_TIPO: number = 5;

export const tipoContatoSchema = z.enum(["telefone", "email"]);
export type TipoContato = z.infer<typeof tipoContatoSchema>;

export const contatoFormSchema = z
  .object({
    tipo: tipoContatoSchema,
    descricao: z
      .string()
      .trim()
      .min(1, "Informe o contato.")
      .max(100, "Máximo de 100 caracteres."),
  })
  .superRefine((contato, ctx): void => {
    if (contato.descricao === "") return;
    const valido: boolean =
      contato.tipo === "email"
        ? validarEmail(contato.descricao)
        : validarTelefone(contato.descricao);
    if (!valido) {
      ctx.addIssue({
        code: "custom",
        path: ["descricao"],
        message:
          contato.tipo === "email"
            ? "E-mail inválido."
            : "Telefone inválido. Use DDD + número.",
      });
    }
  });

export type ContatoFormValores = z.infer<typeof contatoFormSchema>;

export const pessoaFormSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .refine(validarNome, "Use ao menos 4 letras, sem números ou símbolos."),
    cpf: z.string().refine(validarCpf, "CPF inválido."),
    contatos: z.array(contatoFormSchema),
  })
  .superRefine((dados, ctx): void => {
    const emails: number = dados.contatos.filter(
      (c) => c.tipo === "email",
    ).length;
    const telefones: number = dados.contatos.length - emails;
    if (
      emails > LIMITE_CONTATOS_POR_TIPO ||
      telefones > LIMITE_CONTATOS_POR_TIPO
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["contatos"],
        message: `Máximo de ${LIMITE_CONTATOS_POR_TIPO} contatos por tipo.`,
      });
    }
  });

export type PessoaFormValores = z.infer<typeof pessoaFormSchema>;
