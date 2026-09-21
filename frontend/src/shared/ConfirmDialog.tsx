import { Button } from "@/components/ui/button";
import { Modal } from "@/shared/Modal";

type ConfirmDialogProps = {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = "Excluir",
  onConfirmar,
  onCancelar,
}: ConfirmDialogProps): React.JSX.Element {
  return (
    <Modal aberto={aberto} titulo={titulo} onFechar={onCancelar}>
      <p className="text-sm text-muted-foreground">{mensagem}</p>
      <div className="mt-8 flex justify-end gap-3">
        <Button variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirmar}>
          {textoConfirmar}
        </Button>
      </div>
    </Modal>
  );
}
