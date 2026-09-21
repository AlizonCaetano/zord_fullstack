import { Button } from "@/components/ui/button";

type RodapeFormularioProps = {
  salvando: boolean;
  onCancelar: () => void;
  onExcluir?: () => void;
};

export function RodapeFormulario({
  salvando,
  onCancelar,
  onExcluir,
}: RodapeFormularioProps): React.JSX.Element {
  return (
    <div className="mt-2 flex items-center justify-between gap-3 border-t pt-5">
      {onExcluir ? (
        <Button type="button" variant="ghostDestructive" onClick={onExcluir}>
          Excluir
        </Button>
      ) : (
        <span />
      )}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
