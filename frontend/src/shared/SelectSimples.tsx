import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export type OpcaoSelect = {
  label: string;
  value: string;
};

type SelectSimplesProps = {
  opcoes: OpcaoSelect[];
  valor: string;
  onAlterar: (valor: string) => void;
  id?: string;
  ariaLabel?: string;
  disabled?: boolean;
  invalido?: boolean;
  className?: string;
};

export function SelectSimples({
  opcoes,
  valor,
  onAlterar,
  id,
  ariaLabel,
  disabled,
  invalido,
  className,
}: SelectSimplesProps): React.JSX.Element {
  return (
    <Select
      items={opcoes}
      value={valor}
      disabled={disabled}
      onValueChange={(novo) => {
        if (typeof novo === "string") onAlterar(novo);
      }}
    >
      <SelectTrigger
        id={id}
        aria-label={ariaLabel}
        aria-invalid={invalido ? true : undefined}
        className={cn("h-10 w-full", className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {opcoes.map((opcao) => (
          <SelectItem key={opcao.value} value={opcao.value}>
            {opcao.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
