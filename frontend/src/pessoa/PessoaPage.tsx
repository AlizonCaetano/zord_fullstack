import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/shared/Avatar";
import { ConfirmDialog } from "@/shared/ConfirmDialog";
import { DataTable } from "@/shared/DataTable";
import type { Column } from "@/shared/DataTable";
import { EstadoVazio } from "@/shared/EstadoVazio";
import { Modal } from "@/shared/Modal";
import { PageHeader } from "@/shared/PageHeader";
import { RowMenu } from "@/shared/RowMenu";
import { SearchInput } from "@/shared/SearchInput";
import { ApiError } from "@/shared/api";
import { formatarCpf, somenteDigitos } from "@/shared/validadores";
import { PessoaForm } from "@/pessoa/PessoaForm";
import type { PessoaFormValores } from "@/pessoa/pessoa.schema";
import {
  atualizarPessoa,
  criarPessoa,
  excluirPessoa,
  listarPessoas,
} from "@/pessoa/pessoaService";
import type { Pessoa } from "@/pessoa/pessoaService";

const valoresNovaPessoa: PessoaFormValores = {
  nome: "",
  cpf: "",
  contatos: [],
};

export function PessoaPage(): React.JSX.Element {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erroLista, setErroLista] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>("");

  const [emEdicao, setEmEdicao] = useState<Pessoa | null>(null);
  const [criando, setCriando] = useState<boolean>(false);
  const [erroServidor, setErroServidor] = useState<string | null>(null);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [confirmandoExclusao, setConfirmandoExclusao] =
    useState<boolean>(false);

  const carregar = useCallback(async (): Promise<void> => {
    setErroLista(null);
    try {
      const lista: Pessoa[] = await listarPessoas();
      setPessoas(lista);
    } catch (e) {
      setErroLista(
        e instanceof ApiError
          ? e.message
          : "Não foi possível carregar as pessoas.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  const abrirCriacao = (): void => {
    setErroServidor(null);
    setCriando(true);
  };

  const abrirEdicao = (pessoa: Pessoa): void => {
    setErroServidor(null);
    setEmEdicao(pessoa);
  };

  const fecharFormulario = useCallback((): void => {
    setCriando(false);
    setEmEdicao(null);
    setErroServidor(null);
  }, []);

  const salvar = async (valores: PessoaFormValores): Promise<void> => {
    setSalvando(true);
    setErroServidor(null);
    const cpf: string = somenteDigitos(valores.cpf);

    try {
      if (emEdicao) {
        await atualizarPessoa(emEdicao.id, { nome: valores.nome, cpf });
      } else {
        await criarPessoa({
          nome: valores.nome,
          cpf,
          contatos: valores.contatos.map((contato) => ({
            tipo: contato.tipo === "email",
            descricao: contato.descricao,
          })),
        });
      }
      fecharFormulario();
      await carregar();
    } catch (e) {
      setErroServidor(
        e instanceof ApiError ? e.message : "Não foi possível salvar.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (): Promise<void> => {
    if (!emEdicao) return;
    try {
      await excluirPessoa(emEdicao.id);
      setConfirmandoExclusao(false);
      fecharFormulario();
      await carregar();
    } catch (e) {
      setConfirmandoExclusao(false);
      setErroServidor(
        e instanceof ApiError ? e.message : "Não foi possível excluir.",
      );
    }
  };

  const filtradas: Pessoa[] = pessoas.filter((pessoa) =>
    pessoa.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const columns: Column<Pessoa>[] = [
    {
      key: "nome",
      header: "Nome",
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar nome={p.nome} />
          <span>{p.nome}</span>
        </div>
      ),
      sortValue: (p) => p.nome,
    },
    {
      key: "cpf",
      header: "CPF",
      render: (p) => formatarCpf(p.cpf),
      sortValue: (p) => p.cpf,
    },
    {
      key: "acoes",
      header: "",
      render: (p) => (
        <RowMenu onEditar={() => abrirEdicao(p)} label={`Ações de ${p.nome}`} />
      ),
    },
  ];

  const formularioAberto: boolean = criando || emEdicao !== null;
  const valoresIniciais: PessoaFormValores = emEdicao
    ? { nome: emEdicao.nome, cpf: formatarCpf(emEdicao.cpf), contatos: [] }
    : valoresNovaPessoa;

  return (
    <>
      <PageHeader
        title="Pessoas"
        count={carregando ? undefined : pessoas.length}
        actions={<Button onClick={abrirCriacao}>Nova pessoa</Button>}
      />

      <main className="flex flex-1 flex-col gap-6 px-4 pb-6 md:gap-8 md:px-8 md:pb-8">
        <SearchInput
          value={busca}
          onChange={setBusca}
          placeholder="Pesquisar por nome"
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
        ) : pessoas.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma pessoa cadastrada"
            descricao="Cadastre a primeira pessoa para começar a montar a agenda."
          />
        ) : (
          <DataTable
            columns={columns}
            rows={filtradas}
            getRowId={(p) => p.id}
          />
        )}
      </main>

      <Modal
        aberto={formularioAberto}
        titulo={emEdicao ? "Editar pessoa" : "Nova pessoa"}
        onFechar={fecharFormulario}
      >
        <PessoaForm
          key={emEdicao?.id ?? "nova"}
          modo={emEdicao ? "editar" : "criar"}
          valoresIniciais={valoresIniciais}
          erroServidor={erroServidor}
          salvando={salvando}
          onSalvar={(valores) => void salvar(valores)}
          onCancelar={fecharFormulario}
          onExcluir={emEdicao ? () => setConfirmandoExclusao(true) : undefined}
        />
      </Modal>

      <ConfirmDialog
        aberto={confirmandoExclusao}
        titulo="Excluir pessoa"
        mensagem="Os contatos vinculados a esta pessoa também serão excluídos. Esta ação não pode ser desfeita."
        onConfirmar={() => void excluir()}
        onCancelar={() => setConfirmandoExclusao(false)}
      />
    </>
  );
}
