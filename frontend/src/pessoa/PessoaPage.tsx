import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/shared/AppLayout";
import { ConfirmDialog } from "@/shared/ConfirmDialog";
import { DataTable } from "@/shared/DataTable";
import type { Column } from "@/shared/DataTable";
import { Modal } from "@/shared/Modal";
import { RowMenu } from "@/shared/RowMenu";
import { SearchInput } from "@/shared/SearchInput";

type Pessoa = {
  id: number;
  nome: string;
  cpf: string;
};

const pessoasIniciais: Pessoa[] = [
  { id: 1, nome: "Maria Souza", cpf: "111.444.777-35" },
  { id: 2, nome: "João Pereira", cpf: "529.982.247-25" },
  { id: 3, nome: "Ana Lima", cpf: "390.533.447-05" },
];

export function PessoaPage(): React.JSX.Element {
  const [pessoas, setPessoas] = useState<Pessoa[]>(pessoasIniciais);
  const [busca, setBusca] = useState<string>("");
  const [emEdicao, setEmEdicao] = useState<Pessoa | null>(null);
  const [confirmandoExclusao, setConfirmandoExclusao] =
    useState<boolean>(false);

  const filtradas: Pessoa[] = pessoas.filter((pessoa) =>
    pessoa.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const excluir = (): void => {
    if (!emEdicao) return;
    setPessoas((atuais) =>
      atuais.filter((pessoa) => pessoa.id !== emEdicao.id),
    );
    setConfirmandoExclusao(false);
    setEmEdicao(null);
  };

  const columns: Column<Pessoa>[] = [
    {
      key: "nome",
      header: "Nome",
      render: (p) => p.nome,
      sortValue: (p) => p.nome,
    },
    {
      key: "cpf",
      header: "CPF",
      render: (p) => p.cpf,
      sortValue: (p) => p.cpf,
    },
    {
      key: "acoes",
      header: "",
      render: (p) => (
        <RowMenu onEditar={() => setEmEdicao(p)} label={`Ações de ${p.nome}`} />
      ),
    },
  ];

  return (
    <AppLayout title="Pessoas" actions={<Button>Nova pessoa</Button>}>
      <SearchInput
        value={busca}
        onChange={setBusca}
        placeholder="Pesquisar por nome"
      />
      <DataTable columns={columns} rows={filtradas} getRowId={(p) => p.id} />

      <Modal
        aberto={emEdicao !== null}
        titulo="Editar pessoa"
        onFechar={() => setEmEdicao(null)}
      >
        {emEdicao && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="nome" className="text-sm text-muted-foreground">
                Nome
              </label>
              <Input
                id="nome"
                defaultValue={emEdicao.nome}
                placeholder="Nome completo"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="cpf" className="text-sm text-muted-foreground">
                CPF
              </label>
              <Input
                id="cpf"
                defaultValue={emEdicao.cpf}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="mt-3 flex items-center justify-between border-t pt-5">
              <Button
                variant="ghostDestructive"
                onClick={() => setConfirmandoExclusao(true)}
              >
                Excluir
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEmEdicao(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => setEmEdicao(null)}>Salvar</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        aberto={confirmandoExclusao}
        titulo="Excluir pessoa"
        mensagem="Os contatos vinculados a esta pessoa também serão excluídos. Esta ação não pode ser desfeita."
        onConfirmar={excluir}
        onCancelar={() => setConfirmandoExclusao(false)}
      />
    </AppLayout>
  );
}
