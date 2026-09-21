import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
};

export function Modal({
  aberto,
  titulo,
  onFechar,
  children,
}: ModalProps): React.JSX.Element | null {
  useEffect(() => {
    if (!aberto) return;

    const aoPressionarTecla = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onFechar();
    };

    document.addEventListener("keydown", aoPressionarTecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoPressionarTecla);
      document.body.style.overflow = "";
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      className="overlay-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onFechar();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="glass-pop max-h-[calc(100svh-2rem)] w-full max-w-lg overflow-y-auto rounded-md border p-6"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight">
            {titulo}
          </h2>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onFechar}
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
