import { useCallback, useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/shared/Avatar";
import { ConfirmDialog } from "@/shared/ConfirmDialog";
import { ContatoIcone } from "@/shared/ContatoIcone";
import { DataTable } from "@/shared/DataTable";
import type { Column } from "@/shared/DataTable";
import { EstadoVazio } from "@/shared/EstadoVazio";
import { ListaSkeleton } from "@/shared/ListaSkeleton";
import { PageHeader } from "@/shared/PageHeader";
import { RowMenu } from "@/shared/RowMenu";
import { SearchInput } from "@/shared/SearchInput";
import { ApiError } from "@/shared/api";
import { ContatoForm } from "@/contato/ContatoForm";
import type { ContatoCadastroValores } from "@/contato/contato.validation";
import {
  atualizarContato,
  criarContato,
  excluirContato,
  listarContatos,
} from "@/contato/contatoService";
import type { Contato, PessoaResumo } from "@/contato/contatoService";
import { listarPessoas } from "@/pessoa/pessoaService";

export function ContatoPage(): React.JSX.Element {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [pessoas, setPessoas] = useState<PessoaResumo[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erroLista, setErroLista] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>("");

  const [emEdicao, setEmEdicao] = useState<Contato | null>(null);
  const [criando, setCriando] = useState<boolean>(false);
  const [erroServidor, setErroServidor] = useState<string | null>(null);
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

  const abrirCriacao = (): void => {
    setErroServidor(null);
    setCriando(true);
  };

  const abrirEdicao = (contato: Contato): void => {
    setErroServidor(null);
    setEmEdicao(contato);
  };

  const fecharFormulario = (): void => {
    setCriando(false);
    setEmEdicao(null);
    setErroServidor(null);
  };

  const salvar = async (valores: ContatoCadastroValores): Promise<void> => {
    setSalvando(true);
    setErroServidor(null);
    try {
      if (emEdicao) {
        await atualizarContato(emEdicao.id, { descricao: valores.descricao });
      } else {
        await criarContato({
          idPessoa: Number(valores.idPessoa),
          tipo: valores.tipo === "email",
          descricao: valores.descricao,
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
      await excluirContato(emEdicao.id);
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

  const termo: string = busca.trim().toLowerCase();
  const filtrados: Contato[] = contatos.filter(
    (contato) =>
      contato.descricao.toLowerCase().includes(termo) ||
      contato.pessoa.nome.toLowerCase().includes(termo),
  );

  const columns: Column<Contato>[] = [
    {
      key: "contato",
      header: "Contato",
      render: (c) => (
        <div className="flex items-center gap-3">
          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border bg-secondary/60">
            <ContatoIcone email={c.tipo} />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{c.descricao}</p>
            <p className="text-xs text-muted-foreground">
              {c.tipo ? "E-mail" : "Telefone"}
            </p>
          </div>
        </div>
      ),
      sortValue: (c) => c.descricao,
    },
    {
      key: "pessoa",
      header: "Pessoa",
      render: (c) => (
        <div className="flex min-w-0 items-center gap-2">
          <Avatar nome={c.pessoa.nome} tamanho="sm" />
          <span className="truncate text-muted-foreground">
            {c.pessoa.nome}
          </span>
        </div>
      ),
      sortValue: (c) => c.pessoa.nome,
    },
    {
      key: "acoes",
      header: "Ações",
      acao: true,
      render: (c) => (
        <RowMenu
          label={`Ações de ${c.descricao}`}
          acoes={[
            {
              label: "Editar",
              icone: Pencil,
              onSelecionar: () => abrirEdicao(c),
            },
          ]}
        />
      ),
    },
  ];

  const formularioAberto: boolean = criando || emEdicao !== null;
  const valoresIniciais: ContatoCadastroValores = emEdicao
    ? {
        idPessoa: String(emEdicao.pessoa.id),
        tipo: emEdicao.tipo ? "email" : "telefone",
        descricao: emEdicao.descricao,
      }
    : {
        idPessoa: pessoas[0] ? String(pessoas[0].id) : "",
        tipo: "telefone",
        descricao: "",
      };

  return (
    <>
      <PageHeader
        title="Contatos"
        count={carregando ? undefined : contatos.length}
        actions={
          <Button
            onClick={abrirCriacao}
            disabled={carregando || pessoas.length === 0}
          >
            Novo contato
          </Button>
        }
      />

      <main className="flex flex-1 flex-col gap-6 px-4 pb-6 md:gap-8 md:px-8 md:pb-8">
        <SearchInput
          value={busca}
          onChange={setBusca}
          placeholder="Pesquisar por contato ou pessoa"
        />

        {carregando ? (
          <ListaSkeleton />
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
            descricao={
              pessoas.length === 0
                ? "Cadastre uma pessoa primeiro. Todo contato pertence a alguém."
                : "Adicione telefones e e-mails às pessoas cadastradas."
            }
          />
        ) : (
          <DataTable
            columns={columns}
            rows={filtrados}
            getRowId={(c) => c.id}
            onRowClick={abrirEdicao}
          />
        )}
      </main>

      <Dialog
        open={formularioAberto}
        onOpenChange={(abrir: boolean) => {
          if (!abrir) fecharFormulario();
        }}
      >
        <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-medium">
              {emEdicao ? "Editar contato" : "Novo contato"}
            </DialogTitle>
            <DialogDescription>
              {emEdicao
                ? `Contato de ${emEdicao.pessoa.nome}.`
                : "Todo contato pertence a uma pessoa."}
            </DialogDescription>
          </DialogHeader>
          <ContatoForm
            key={emEdicao?.id ?? "novo"}
            modo={emEdicao ? "editar" : "criar"}
            pessoas={pessoas}
            valoresIniciais={valoresIniciais}
            erroServidor={erroServidor}
            salvando={salvando}
            onSalvar={(valores) => void salvar(valores)}
            onCancelar={fecharFormulario}
            onExcluir={
              emEdicao ? () => setConfirmandoExclusao(true) : undefined
            }
          />
        </DialogContent>
      </Dialog>

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
