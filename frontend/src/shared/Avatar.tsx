type TamanhoAvatar = "sm" | "md" | "lg";

type AvatarProps = {
  nome: string;
  tamanho?: TamanhoAvatar;
};

const classesTamanho: Record<TamanhoAvatar, string> = {
  sm: "size-6 text-[10px]",
  md: "size-9 text-xs",
  lg: "size-14 text-base",
};

function iniciais(nome: string): string {
  const partes: string[] = nome.trim().split(/\s+/);
  const primeira: string = partes[0]?.[0] ?? "";
  const ultima: string =
    partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

export function Avatar({
  nome,
  tamanho = "md",
}: AvatarProps): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border bg-secondary font-medium text-foreground ${classesTamanho[tamanho]}`}
    >
      {iniciais(nome)}
    </span>
  );
}
