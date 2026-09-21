import { MoreHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type AcaoLinha = {
  label: string;
  icone: LucideIcon;
  onSelecionar: () => void;
};

type RowMenuProps = {
  acoes: AcaoLinha[];
  label?: string;
};

export function RowMenu({
  acoes,
  label = "Abrir ações",
}: RowMenuProps): React.JSX.Element {
  return (
    <div
      className="flex justify-end"
      onClick={(evento) => evento.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={label}
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          {acoes.map((acao) => (
            <DropdownMenuItem key={acao.label} onClick={acao.onSelecionar}>
              <acao.icone className="size-4" />
              {acao.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
