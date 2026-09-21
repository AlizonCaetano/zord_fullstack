import { Inbox } from "lucide-react";

type EstadoVazioProps = {
  titulo: string;
  descricao: string;
};

export function EstadoVazio({
  titulo,
  descricao,
}: EstadoVazioProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full border bg-secondary/50">
        <Inbox className="size-5 text-muted-foreground" />
      </span>
      <p className="font-serif text-lg">{titulo}</p>
      <p className="max-w-xs text-sm text-muted-foreground">{descricao}</p>
    </div>
  );
}
