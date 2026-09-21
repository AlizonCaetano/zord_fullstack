import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Campo } from "@/shared/Campo";
import { RodapeFormulario } from "@/shared/RodapeFormulario";
import { SelectSimples } from "@/shared/SelectSimples";
import type { OpcaoSelect } from "@/shared/SelectSimples";
import {
  TIPOS_CONTATO,
  contatoCadastroSchema,
  tipoContatoSchema,
} from "@/contato/contato.validation";
import type {
  ContatoCadastroValores,
  TipoContato,
} from "@/contato/contato.validation";
import type { PessoaResumo } from "@/contato/contatoService";

type ContatoFormProps = {
  modo: "criar" | "editar";
  pessoas: PessoaResumo[];
  valoresIniciais: ContatoCadastroValores;
  erroServidor: string | null;
  salvando: boolean;
  onSalvar: (valores: ContatoCadastroValores) => void;
  onCancelar: () => void;
  onExcluir?: () => void;
};

export function ContatoForm({
  modo,
  pessoas,
  valoresIniciais,
  erroServidor,
  salvando,
  onSalvar,
  onCancelar,
  onExcluir,
}: ContatoFormProps): React.JSX.Element {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContatoCadastroValores>({
    resolver: zodResolver(contatoCadastroSchema),
    defaultValues: valoresIniciais,
    mode: "onTouched",
  });

  const tipo: TipoContato = useWatch({ control, name: "tipo" });
  const editando: boolean = modo === "editar";
  const opcoesPessoas: OpcaoSelect[] = pessoas.map((pessoa) => ({
    label: pessoa.nome,
    value: String(pessoa.id),
  }));

  return (
    <form
      onSubmit={handleSubmit(onSalvar)}
      noValidate
      className="flex flex-col gap-5"
    >
      <Campo id="pessoa" rotulo="Pessoa" erro={errors.idPessoa?.message}>
        <Controller
          control={control}
          name="idPessoa"
          render={({ field }) => (
            <SelectSimples
              id="pessoa"
              opcoes={opcoesPessoas}
              valor={field.value}
              onAlterar={field.onChange}
              disabled={editando}
              invalido={errors.idPessoa !== undefined}
            />
          )}
        />
      </Campo>

      <Campo id="tipo" rotulo="Tipo" erro={errors.tipo?.message}>
        <Controller
          control={control}
          name="tipo"
          render={({ field }) => (
            <SelectSimples
              id="tipo"
              opcoes={TIPOS_CONTATO}
              valor={field.value}
              onAlterar={(valor) => {
                const resultado = tipoContatoSchema.safeParse(valor);
                if (resultado.success) field.onChange(resultado.data);
              }}
              disabled={editando}
            />
          )}
        />
      </Campo>

      <Campo id="descricao" rotulo="Descrição" erro={errors.descricao?.message}>
        <Input
          id="descricao"
          placeholder={
            tipo === "email" ? "email@exemplo.com" : "(47) 99999-0000"
          }
          inputMode={tipo === "email" ? "email" : "tel"}
          aria-invalid={errors.descricao ? true : undefined}
          {...register("descricao")}
        />
      </Campo>

      {editando && (
        <p className="text-xs text-muted-foreground">
          Pessoa e tipo não mudam na edição. Para trocar, exclua e crie outro
          contato.
        </p>
      )}

      {erroServidor && (
        <p role="alert" className="text-sm text-brand-red">
          {erroServidor}
        </p>
      )}

      <RodapeFormulario
        salvando={salvando}
        onCancelar={onCancelar}
        onExcluir={onExcluir}
      />
    </form>
  );
}
