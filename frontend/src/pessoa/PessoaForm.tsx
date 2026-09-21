import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatarCpf } from "@/shared/validadores";
import {
  LIMITE_CONTATOS_POR_TIPO,
  contatoFormSchema,
  pessoaFormSchema,
} from "@/pessoa/pessoa.schema";
import type {
  ContatoFormValores,
  PessoaFormValores,
  TipoContato,
} from "@/pessoa/pessoa.schema";

type PessoaFormProps = {
  modo: "criar" | "editar";
  valoresIniciais: PessoaFormValores;
  erroServidor: string | null;
  salvando: boolean;
  onSalvar: (valores: PessoaFormValores) => void;
  onCancelar: () => void;
  onExcluir?: () => void;
};

const campoSelect: string =
  "h-10 rounded-md border border-input bg-background/40 px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring";

function MensagemErro({
  mensagem,
}: {
  mensagem: string | undefined;
}): React.JSX.Element | null {
  if (!mensagem) return null;
  return <p className="text-xs text-brand-red">{mensagem}</p>;
}

export function PessoaForm({
  modo,
  valoresIniciais,
  erroServidor,
  salvando,
  onSalvar,
  onCancelar,
  onExcluir,
}: PessoaFormProps): React.JSX.Element {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PessoaFormValores>({
    resolver: zodResolver(pessoaFormSchema),
    defaultValues: valoresIniciais,
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contatos",
  });
  const contatos: ContatoFormValores[] =
    useWatch({ control, name: "contatos" }) ?? [];

  const emails: number = contatos.filter((c) => c.tipo === "email").length;
  const telefones: number = contatos.length - emails;
  const proximoTipo: TipoContato | null =
    telefones < LIMITE_CONTATOS_POR_TIPO
      ? "telefone"
      : emails < LIMITE_CONTATOS_POR_TIPO
        ? "email"
        : null;

  const ultimo: ContatoFormValores | undefined = contatos.at(-1);
  const ultimoValido: boolean =
    ultimo === undefined || contatoFormSchema.safeParse(ultimo).success;
  const podeAdicionar: boolean = ultimoValido && proximoTipo !== null;

  const cpfRegistro = register("cpf");
  const erroListaContatos: string | undefined =
    errors.contatos?.root?.message ?? errors.contatos?.message;

  return (
    <form
      onSubmit={handleSubmit(onSalvar)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="nome" className="text-sm text-muted-foreground">
          Nome
        </label>
        <Input
          id="nome"
          placeholder="Nome completo"
          autoComplete="name"
          aria-invalid={errors.nome ? true : undefined}
          {...register("nome")}
        />
        <MensagemErro mensagem={errors.nome?.message} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="cpf" className="text-sm text-muted-foreground">
          CPF
        </label>
        <Input
          id="cpf"
          placeholder="000.000.000-00"
          inputMode="numeric"
          aria-invalid={errors.cpf ? true : undefined}
          {...cpfRegistro}
          onChange={(evento) => {
            evento.target.value = formatarCpf(evento.target.value);
            void cpfRegistro.onChange(evento);
          }}
        />
        <MensagemErro mensagem={errors.cpf?.message} />
      </div>

      {modo === "criar" && (
        <fieldset className="flex flex-col gap-3 border-t pt-5">
          <div className="flex items-baseline justify-between">
            <legend className="text-sm text-muted-foreground">Contatos</legend>
            <span className="text-xs text-muted-foreground">
              {telefones}/{LIMITE_CONTATOS_POR_TIPO} tel · {emails}/
              {LIMITE_CONTATOS_POR_TIPO} e-mail
            </span>
          </div>

          {fields.map((field, index: number) => {
            const tipoAtual: TipoContato = contatos[index]?.tipo ?? "telefone";
            const erroDescricao: string | undefined =
              errors.contatos?.[index]?.descricao?.message;

            return (
              <div key={field.id} className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <select
                    aria-label={`Tipo do contato ${index + 1}`}
                    className={`${campoSelect} w-32 shrink-0`}
                    {...register(`contatos.${index}.tipo`)}
                  >
                    <option value="telefone">Telefone</option>
                    <option value="email">E-mail</option>
                  </select>
                  <Input
                    aria-label={`Descrição do contato ${index + 1}`}
                    placeholder={
                      tipoAtual === "email"
                        ? "email@exemplo.com"
                        : "(47) 99999-0000"
                    }
                    inputMode={tipoAtual === "email" ? "email" : "tel"}
                    aria-invalid={erroDescricao ? true : undefined}
                    {...register(`contatos.${index}.descricao`)}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remover contato ${index + 1}`}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <MensagemErro mensagem={erroDescricao} />
              </div>
            );
          })}

          <MensagemErro mensagem={erroListaContatos} />

          <div className="flex flex-col items-start gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!podeAdicionar}
              onClick={() => {
                if (proximoTipo) append({ tipo: proximoTipo, descricao: "" });
              }}
            >
              <Plus />
              Adicionar contato
            </Button>
            {!ultimoValido && (
              <p className="text-xs text-muted-foreground">
                Preencha o contato anterior para adicionar outro.
              </p>
            )}
          </div>
        </fieldset>
      )}

      {erroServidor && (
        <p role="alert" className="text-sm text-brand-red">
          {erroServidor}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between border-t pt-5">
        {modo === "editar" && onExcluir ? (
          <Button type="button" variant="ghostDestructive" onClick={onExcluir}>
            Excluir
          </Button>
        ) : (
          <span />
        )}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>
    </form>
  );
}
