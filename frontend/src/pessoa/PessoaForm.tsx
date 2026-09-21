import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Campo } from "@/shared/Campo";
import { RodapeFormulario } from "@/shared/RodapeFormulario";
import { SelectSimples } from "@/shared/SelectSimples";
import { formatarCpf } from "@/shared/validadores";
import {
  TIPOS_CONTATO,
  contatoFormSchema,
  tipoContatoSchema,
} from "@/contato/contato.validation";
import type {
  ContatoFormValores,
  TipoContato,
} from "@/contato/contato.validation";
import {
  LIMITE_CONTATOS_POR_TIPO,
  pessoaFormSchema,
} from "@/pessoa/pessoa.validation";
import type { PessoaFormValores } from "@/pessoa/pessoa.validation";

type PessoaFormProps = {
  modo: "criar" | "editar";
  valoresIniciais: PessoaFormValores;
  erroServidor: string | null;
  salvando: boolean;
  onSalvar: (valores: PessoaFormValores) => void;
  onCancelar: () => void;
  onExcluir?: () => void;
};

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
      <Campo id="nome" rotulo="Nome" erro={errors.nome?.message}>
        <Input
          id="nome"
          placeholder="Nome completo"
          autoComplete="name"
          aria-invalid={errors.nome ? true : undefined}
          {...register("nome")}
        />
      </Campo>

      <Campo id="cpf" rotulo="CPF" erro={errors.cpf?.message}>
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
      </Campo>

      {modo === "criar" && (
        <fieldset className="flex flex-col gap-3 border-t pt-5">
          <div className="flex items-baseline justify-between">
            <legend className="text-sm text-muted-foreground">Contatos</legend>
            <span className="text-xs tabular-nums text-muted-foreground">
              {telefones}/{LIMITE_CONTATOS_POR_TIPO} tel · {emails}/
              {LIMITE_CONTATOS_POR_TIPO} e-mail
            </span>
          </div>

          {fields.map((item, index: number) => {
            const tipoAtual: TipoContato = contatos[index]?.tipo ?? "telefone";
            const erroDescricao: string | undefined =
              errors.contatos?.[index]?.descricao?.message;

            return (
              <div key={item.id} className="flex flex-col gap-1">
                <div className="flex items-start gap-2">
                  <Controller
                    control={control}
                    name={`contatos.${index}.tipo`}
                    render={({ field }) => (
                      <SelectSimples
                        ariaLabel={`Tipo do contato ${index + 1}`}
                        opcoes={TIPOS_CONTATO}
                        valor={field.value}
                        onAlterar={(valor) => {
                          const resultado = tipoContatoSchema.safeParse(valor);
                          if (resultado.success) field.onChange(resultado.data);
                        }}
                        className="w-32 shrink-0"
                      />
                    )}
                  />
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label={`Remover contato ${index + 1}`}
                    className="shrink-0 text-muted-foreground"
                  >
                    <X />
                  </Button>
                </div>
                {erroDescricao && (
                  <p className="text-xs text-brand-red">{erroDescricao}</p>
                )}
              </div>
            );
          })}

          {erroListaContatos && (
            <p className="text-xs text-brand-red">{erroListaContatos}</p>
          )}

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

      <RodapeFormulario
        salvando={salvando}
        onCancelar={onCancelar}
        onExcluir={modo === "editar" ? onExcluir : undefined}
      />
    </form>
  );
}
