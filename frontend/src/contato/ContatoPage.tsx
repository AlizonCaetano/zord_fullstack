import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/shared/ConfirmDialog";
import { DataTable } from "@/shared/DataTable";
import type { Column } from "@/shared/DataTable";
import { EstadoVazio } from "@/shared/EstadoVazio";
import { Modal } from "@/shared/Modal";
import { PageHeader } from "@/shared/PageHeader";
import { RowMenu } from "@/shared/RowMenu";
import { SearchInput } from "@/shared/SearchInput";
import { ApiError } from "@/shared/api";
import {
  atualizarContato,
  criarContato,
  excluirContato,
  listarContatos,
} from "@/contato/contatoService";
import type { Contato } from "@/contato/contatoService";
import { listarPessoas } from "@/pessoa/pessoaService";
import type { Pessoa } from "@/pessoa/pessoaService";

type Formulario = {
  tipo: boolean;
  descricao: string;
  idPessoa: number;
};

const formularioVazio: Formulario = { tipo: false, descricao: "", idPessoa: 0 };

export function ContatoPage(): React.JSX.Element {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erroLista, setErroLista] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>("");

  const [emEdicao, setEmEdicao] = useState<Contato | null>(null);
  const [criando, setCriando] = useState<boolean>(false);
  const [formulario, setFormulario] = useState<Formulario>(formularioVazio);
  const [erroFormulario, setErroFormulario] = useState<string | null>(null);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [confirmandoExclusao, setConfirmandoExclusao] =
    useState<boolean>(false);

  const carregar = useCallback(async (): Promise<void> => {
    setErroLista(null);
    try {
      const [listaContatos, listaPessoas] = await Promise.all([
        listarContatos(),
        listarPessoas(),
      ]);
      setContatos(listaContatos);
      setPessoas(listaPessoas);
    } catch (e) {
      setErroLista(
        e instanceof ApiError
          ? e.message
          : "Não foi possível carregar os contatos.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const nomeDaPessoa = (idPessoa: number): string =>
    pessoas.find((pessoa) => pessoa.id === idPessoa)?.nome ?? "—";

  const abrirCriacao = (): void => {
    setFormulario({ ...formularioVazio, idPessoa: pessoas[0]?.id ?? 0 });
    setErroFormulario(null);
    setCriando(true);
  };

  const abrirEdicao = (contato: Contato): void => {
    setFormulario({
      tipo: contato.tipo,
      descricao: contato.descricao,
      idPessoa: contato.idPessoa,
    });
    setErroFormulario(null);
    setEmEdicao(contato);
  };

  const fecharFormulario = (): void => {
    setCriando(false);
    setEmEdicao(null);
    setErroFormulario(null);
  };

  const salvar = async (): Promise<void> => {
    setSalvando(true);
    setErroFormulario(null);
    try {
      if (emEdicao) {
        await atualizarContato(emEdicao.id, formulario);
      } else {
        await criarContato(formulario);
      }
      fecharFormulario();
      await carregar();
    } catch (e) {
      setErroFormulario(
        e instanceof ApiError ? e.message : "Não foi possível salvar.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (): Promise<void> => {
    if (!emEdicao) return;
    try {
      await excluirContato(emEdicao.id);
      setConfirmandoExclusao(false);
      fecharFormulario();
      await carregar();
    } catch (e) {
      setConfirmandoExclusao(false);
      setErroFormulario(
        e instanceof ApiError ? e.message : "Não foi possível excluir.",
      );
    }
  };

  const filtrados: Contato[] = contatos.filter((contato) =>
    contato.descricao.toLowerCase().includes(busca.toLowerCase()),
  );

  const columns: Column<Contato>[] = [
    {
      key: "tipo",
      header: "Tipo",
      render: (c) => (c.tipo ? "E-mail" : "Telefone"),
      sortValue: (c) => (c.tipo ? "email" : "telefone"),
    },
    {
      key: "descricao",
      header: "Descrição",
      render: (c) => c.descricao,
      sortValue: (c) => c.descricao,
    },
    {
      key: "pessoa",
      header: "Pessoa",
      render: (c) => nomeDaPessoa(c.idPessoa),
      sortValue: (c) => nomeDaPessoa(c.idPessoa),
    },
    {
      key: "acoes",
      header: "",
      render: (c) => (
        <RowMenu
          onEditar={() => abrirEdicao(c)}
          label={`Ações de ${c.descricao}`}
        />
      ),
    },
  ];

  const formularioAberto: boolean = criando || emEdicao !== null;

  return (
    <>
      <PageHeader
        title="Contatos"
        count={carregando ? undefined : contatos.length}
        actions={
          <Button onClick={abrirCriacao} disabled={pessoas.length === 0}>
            Novo contato
          </Button>
        }
      />

      <main className="flex flex-1 flex-col gap-8 px-8 pb-8">
        <SearchInput
          value={busca}
          onChange={setBusca}
          placeholder="Pesquisar por descrição"
        />

        {carregando ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Carregando...
          </p>
        ) : erroLista ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-sm text-brand-red">{erroLista}</p>
            <Button variant="outline" onClick={() => void carregar()}>
              Tentar novamente
            </Button>
          </div>
        ) : contatos.length === 0 ? (
          <EstadoVazio
            titulo="Nenhum contato cadastrado"
            descricao="Cadastre uma pessoa primeiro e depois adicione telefones e e-mails."
          />
        ) : (
          <DataTable
            columns={columns}
            rows={filtrados}
            getRowId={(c) => c.id}
          />
        )}
      </main>

      <Modal
        aberto={formularioAberto}
        titulo={emEdicao ? "Editar contato" : "Novo contato"}
        onFechar={fecharFormulario}
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="pessoa" className="text-sm text-muted-foreground">
              Pessoa
            </label>
            <select
              id="pessoa"
              value={formulario.idPessoa}
              onChange={(evento) =>
                setFormulario((atual) => ({
                  ...atual,
                  idPessoa: Number(evento.target.value),
                }))
              }
              className="h-10 w-full rounded-md border border-input bg-background/40 px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            >
              {pessoas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tipo" className="text-sm text-muted-foreground">
              Tipo
            </label>
            <select
              id="tipo"
              value={formulario.tipo ? "email" : "telefone"}
              onChange={(evento) =>
                setFormulario((atual) => ({
                  ...atual,
                  tipo: evento.target.value === "email",
                }))
              }
              className="h-10 w-full rounded-md border border-input bg-background/40 px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="telefone">Telefone</option>
              <option value="email">E-mail</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="descricao"
              className="text-sm text-muted-foreground"
            >
              Descrição
            </label>
            <Input
              id="descricao"
              value={formulario.descricao}
              onChange={(evento) =>
                setFormulario((atual) => ({
                  ...atual,
                  descricao: evento.target.value,
                }))
              }
              placeholder={
                formulario.tipo ? "email@exemplo.com" : "(47) 99999-0000"
              }
            />
          </div>

          {erroFormulario && (
            <p role="alert" className="text-sm text-brand-red">
              {erroFormulario}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between border-t pt-5">
            {emEdicao ? (
              <Button
                variant="ghostDestructive"
                onClick={() => setConfirmandoExclusao(true)}
              >
                Excluir
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={fecharFormulario}>
                Cancelar
              </Button>
              <Button onClick={() => void salvar()} disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        aberto={confirmandoExclusao}
        titulo="Excluir contato"
        mensagem="Esta ação não pode ser desfeita."
        onConfirmar={() => void excluir()}
        onCancelar={() => setConfirmandoExclusao(false)}
      />
    </>
  );
}
