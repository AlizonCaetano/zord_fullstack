import { Mail, Phone } from "lucide-react";

import { cn } from "@/lib/utils";

type ContatoIconeProps = {
  email: boolean;
  className?: string;
};

export function ContatoIcone({
  email,
  className,
}: ContatoIconeProps): React.JSX.Element {
  const Icone = email ? Mail : Phone;
  return (
    <Icone
      aria-hidden="true"
      className={cn("size-4 shrink-0 text-muted-foreground", className)}
    />
  );
}
