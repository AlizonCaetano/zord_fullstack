import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil } from "lucide-react";

type RowMenuProps = {
  onEditar: () => void;
  label?: string;
};

export function RowMenu({
  onEditar,
  label = "Abrir menu",
}: RowMenuProps): React.JSX.Element {
  const [aberto, setAberto] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;

    const aoClicarFora = (event: MouseEvent): void => {
      if (!containerRef.current?.contains(event.target as Node))
        setAberto(false);
    };
    const aoPressionarTecla = (event: KeyboardEvent): void => {
      if (event.key === "Escape") setAberto(false);
    };

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoPressionarTecla);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoPressionarTecla);
    };
  }, [aberto]);

  return (
    <div ref={containerRef} className="relative flex justify-end">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((atual) => !atual)}
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {aberto && (
        <div
          role="menu"
          className="glass-pop absolute right-0 top-9 z-20 min-w-36 rounded-md border p-1"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setAberto(false);
              onEditar();
            }}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm outline-none transition-colors hover:bg-secondary focus-visible:bg-secondary"
          >
            <Pencil className="size-4" />
            Editar
          </button>
        </div>
      )}
    </div>
  );
}
