import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

type CampoProps = {
  id: string;
  rotulo: string;
  erro?: string;
  children: ReactNode;
};

export function Campo({
  id,
  rotulo,
  erro,
  children,
}: CampoProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-muted-foreground">
        {rotulo}
      </Label>
      {children}
      {erro && <p className="text-xs text-brand-red">{erro}</p>}
    </div>
  );
}
