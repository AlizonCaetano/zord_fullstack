type AvatarProps = {
  nome: string;
};

function iniciais(nome: string): string {
  const partes: string[] = nome.trim().split(/\s+/);
  const primeira: string = partes[0]?.[0] ?? "";
  const ultima: string =
    partes.length > 1 ? (partes[partes.length - 1][0] ?? "") : "";
  return (primeira + ultima).toUpperCase();
}

export function Avatar({ nome }: AvatarProps): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border bg-secondary text-xs font-medium text-muted-foreground"
    >
      {iniciais(nome)}
    </span>
  );
}
