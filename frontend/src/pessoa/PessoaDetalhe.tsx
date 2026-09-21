import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar } from "@/shared/Avatar";
import { ContatoIcone } from "@/shared/ContatoIcone";
import { formatarCpf, somenteDigitos } from "@/shared/validadores";
import type { ContatoResumo, Pessoa } from "@/pessoa/pessoaService";

const Ancora = "a" as const;

type PessoaDetalheProps = {
  pessoa: Pessoa | null;
  aberto: boolean;
  onFechar: () => void;
  onEditar: (pessoa: Pessoa) => void;
};

type GrupoContatosProps = {
  titulo: string;
  contatos: ContatoResumo[];
  email: boolean;
};

function GrupoContatos({
  titulo,
  contatos,
  email,
}: GrupoContatosProps): React.JSX.Element {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {titulo}
      </h3>
      {contatos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum cadastrado.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {contatos.map((contato) => (
            <li
              key={contato.id}
              className="flex items-center gap-3 rounded-md border bg-secondary/30 px-3 py-2.5"
            >
              <ContatoIcone email={email} />
              <Ancora
                href={
                  email
                    ? `mailto:${contato.descricao}`
                    : `tel:${somenteDigitos(contato.descricao)}`
                }
                className="min-w-0 flex-1 truncate text-sm outline-none hover:underline focus-visible:underline"
              >
                {contato.descricao}
              </Ancora>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function PessoaDetalhe({
  pessoa,
  aberto,
  onFechar,
  onEditar,
}: PessoaDetalheProps): React.JSX.Element {
  const telefones: ContatoResumo[] =
    pessoa?.contatos.filter((c) => !c.tipo) ?? [];
  const emails: ContatoResumo[] = pessoa?.contatos.filter((c) => c.tipo) ?? [];

  return (
    <Sheet
      open={aberto}
      onOpenChange={(abrir: boolean) => {
        if (!abrir) onFechar();
      }}
    >
      <SheetContent side="right" className="w-full sm:max-w-md">
        {pessoa && (
          <>
            <SheetHeader className="gap-4 border-b pb-6">
              <div className="flex items-center gap-4">
                <Avatar nome={pessoa.nome} tamanho="lg" />
                <div className="min-w-0">
                  <SheetTitle className="truncate font-serif text-2xl font-medium">
                    {pessoa.nome}
                  </SheetTitle>
                  <SheetDescription className="tabular-nums">
                    CPF {formatarCpf(pessoa.cpf)}
                  </SheetDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="gap-1.5 font-normal">
                  <ContatoIcone email={false} className="size-3" />
                  {telefones.length} telefone{telefones.length === 1 ? "" : "s"}
                </Badge>
                <Badge variant="outline" className="gap-1.5 font-normal">
                  <ContatoIcone email className="size-3" />
                  {emails.length} e-mail{emails.length === 1 ? "" : "s"}
                </Badge>
              </div>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-2">
              <GrupoContatos
                titulo="Telefones"
                contatos={telefones}
                email={false}
              />
              <GrupoContatos titulo="E-mails" contatos={emails} email />
            </div>

            <SheetFooter>
              <Button onClick={() => onEditar(pessoa)}>
                <Pencil />
                Editar pessoa
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
