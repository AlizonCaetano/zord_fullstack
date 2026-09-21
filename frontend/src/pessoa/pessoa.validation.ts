import { z } from "zod";

import { validarCpf, validarNome } from "@/shared/validadores";
import { contatoFormSchema } from "@/contato/contato.validation";

export const LIMITE_CONTATOS_POR_TIPO: number = 5;

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
