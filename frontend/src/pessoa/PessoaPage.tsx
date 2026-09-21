import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { formatarCpf, somenteDigitos } from "@/shared/validadores";
import { PessoaDetalhe } from "@/pessoa/PessoaDetalhe";
import { PessoaForm } from "@/pessoa/PessoaForm";
import type { PessoaFormValores } from "@/pessoa/pessoa.validation";
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

function ResumoContatos({ pessoa }: { pessoa: Pessoa }): React.JSX.Element {
  const emails: number = pessoa.contatos.filter((c) => c.tipo).length;
  const telefones: number = pessoa.contatos.length - emails;

  if (pessoa.contatos.length === 0) {
    return <span className="text-xs text-muted-foreground">Sem contatos</span>;
  }

  return (
    <div className="flex gap-1.5">
      {telefones > 0 && (
        <Badge variant="outline" className="gap-1 font-normal tabular-nums">
          <ContatoIcone email={false} className="size-3" />
          {telefones}
        </Badge>
      )}
      {emails > 0 && (
        <Badge variant="outline" className="gap-1 font-normal tabular-nums">
          <ContatoIcone email className="size-3" />
          {emails}
        </Badge>
      )}
    </div>
  );
}

export function PessoaPage(): React.JSX.Element {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erroLista, setErroLista] = useState<string | null>(null);
  const [busca, setBusca] = useState<string>("");

  const [detalhe, setDetalhe] = useState<Pessoa | null>(null);
  const [detalheAberto, setDetalheAberto] = useState<boolean>(false);

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

  const abrirDetalhe = (pessoa: Pessoa): void => {
    setDetalhe(pessoa);
    setDetalheAberto(true);
  };

  const abrirCriacao = (): void => {
    setErroServidor(null);
    setCriando(true);
  };

  const abrirEdicao = (pessoa: Pessoa): void => {
    setDetalheAberto(false);
    setErroServidor(null);
    setEmEdicao(pessoa);
  };

  const fecharFormulario = (): void => {
    setCriando(false);
    setEmEdicao(null);
    setErroServidor(null);
  };

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

  const termo: string = busca.trim().toLowerCase();
  const termoDigitos: string = somenteDigitos(busca);
  const filtradas: Pessoa[] = pessoas.filter(
    (pessoa) =>
      pessoa.nome.toLowerCase().includes(termo) ||
      (termoDigitos !== "" && pessoa.cpf.includes(termoDigitos)),
  );

  const columns: Column<Pessoa>[] = [
    {
      key: "pessoa",
      header: "Pessoa",
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar nome={p.nome} />
          <div className="min-w-0">
            <p className="truncate font-medium">{p.nome}</p>
            <p className="text-xs tabular-nums text-muted-foreground">
              {formatarCpf(p.cpf)}
            </p>
          </div>
        </div>
      ),
      sortValue: (p) => p.nome,
    },
    {
      key: "contatos",
      header: "Contatos",
      render: (p) => <ResumoContatos pessoa={p} />,
      sortValue: (p) => p.contatos.length,
    },
    {
      key: "acoes",
      header: "Ações",
      acao: true,
      render: (p) => (
        <RowMenu
          label={`Ações de ${p.nome}`}
          acoes={[
            {
              label: "Ver detalhes",
              icone: Eye,
              onSelecionar: () => abrirDetalhe(p),
            },
            {
              label: "Editar",
              icone: Pencil,
              onSelecionar: () => abrirEdicao(p),
            },
          ]}
        />
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
          placeholder="Pesquisar por nome ou CPF"
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
        ) : pessoas.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma pessoa cadastrada"
            descricao="Cadastre a primeira pessoa, já com telefones e e-mails."
          />
        ) : (
          <DataTable
            columns={columns}
            rows={filtradas}
            getRowId={(p) => p.id}
            onRowClick={abrirDetalhe}
          />
        )}
      </main>

      <PessoaDetalhe
        pessoa={detalhe}
        aberto={detalheAberto}
        onFechar={() => setDetalheAberto(false)}
        onEditar={abrirEdicao}
      />

      <Dialog
        open={formularioAberto}
        onOpenChange={(abrir: boolean) => {
          if (!abrir) fecharFormulario();
        }}
      >
        <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-medium">
              {emEdicao ? "Editar pessoa" : "Nova pessoa"}
            </DialogTitle>
            <DialogDescription>
              {emEdicao
                ? "Contatos são gerenciados na tela de Contatos."
                : "Os contatos são gravados junto com a pessoa."}
            </DialogDescription>
          </DialogHeader>
          <PessoaForm
            key={emEdicao?.id ?? "nova"}
            modo={emEdicao ? "editar" : "criar"}
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
        titulo="Excluir pessoa"
        mensagem="Os contatos vinculados a esta pessoa também serão excluídos. Esta ação não pode ser desfeita."
        onConfirmar={() => void excluir()}
        onCancelar={() => setConfirmandoExclusao(false)}
      />
    </>
  );
}
