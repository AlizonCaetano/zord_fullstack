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

type TipoContato = "telefone" | "email";

type Contato = {
  id: number;
  tipo: TipoContato;
  descricao: string;
  pessoa: string;
};

const contatosIniciais: Contato[] = [
  {
    id: 1,
    tipo: "email",
    descricao: "maria@exemplo.com",
    pessoa: "Maria Souza",
  },
  {
    id: 2,
    tipo: "telefone",
    descricao: "(47) 99999-1234",
    pessoa: "João Pereira",
  },
  { id: 3, tipo: "email", descricao: "ana@exemplo.com", pessoa: "Ana Lima" },
];

export function ContatoPage(): React.JSX.Element {
  const [contatos, setContatos] = useState<Contato[]>(contatosIniciais);
  const [busca, setBusca] = useState<string>("");
  const [emEdicao, setEmEdicao] = useState<Contato | null>(null);
  const [confirmandoExclusao, setConfirmandoExclusao] =
    useState<boolean>(false);

  const filtrados: Contato[] = contatos.filter((contato) =>
    contato.descricao.toLowerCase().includes(busca.toLowerCase()),
  );

  const excluir = (): void => {
    if (!emEdicao) return;
    setContatos((atuais) =>
      atuais.filter((contato) => contato.id !== emEdicao.id),
    );
    setConfirmandoExclusao(false);
    setEmEdicao(null);
  };

  const columns: Column<Contato>[] = [
    {
      key: "tipo",
      header: "Tipo",
      render: (c) => (c.tipo === "email" ? "E-mail" : "Telefone"),
      sortValue: (c) => c.tipo,
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
      render: (c) => c.pessoa,
      sortValue: (c) => c.pessoa,
    },
    {
      key: "acoes",
      header: "",
      render: (c) => (
        <RowMenu
          onEditar={() => setEmEdicao(c)}
          label={`Ações de ${c.descricao}`}
        />
      ),
    },
  ];

  return (
    <AppLayout title="Contatos" actions={<Button>Novo contato</Button>}>
      <SearchInput
        value={busca}
        onChange={setBusca}
        placeholder="Pesquisar por descrição"
      />
      <DataTable columns={columns} rows={filtrados} getRowId={(c) => c.id} />

      <Modal
        aberto={emEdicao !== null}
        titulo="Editar contato"
        onFechar={() => setEmEdicao(null)}
      >
        {emEdicao && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="descricao"
                className="text-sm text-muted-foreground"
              >
                Descrição
              </label>
              <Input
                id="descricao"
                defaultValue={emEdicao.descricao}
                placeholder="Telefone ou e-mail"
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
        titulo="Excluir contato"
        mensagem="Esta ação não pode ser desfeita."
        onConfirmar={excluir}
        onCancelar={() => setConfirmandoExclusao(false)}
      />
    </AppLayout>
  );
}
