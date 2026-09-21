import { Skeleton } from "@/components/ui/skeleton";

type ListaSkeletonProps = {
  linhas?: number;
};

export function ListaSkeleton({
  linhas = 4,
}: ListaSkeletonProps): React.JSX.Element {
  return (
    <div className="flex flex-col" aria-busy="true" aria-label="Carregando">
      {Array.from({ length: linhas }, (_, indice: number) => (
        <div
          key={indice}
          className="flex items-center gap-3 border-b py-4 last:border-b-0"
        >
          <Skeleton className="size-9 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="hidden h-6 w-20 md:block" />
        </div>
      ))}
    </div>
  );
}
