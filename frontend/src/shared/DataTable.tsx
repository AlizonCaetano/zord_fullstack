import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  acao?: boolean;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
};

type SortState = {
  key: string;
  direction: "asc" | "desc";
};

function MarcadorHover(): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-1/4 left-0 w-0.5 scale-y-50 bg-foreground opacity-0 transition duration-200 group-hover:scale-y-100 group-hover:opacity-100 motion-reduce:transition-none"
    />
  );
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  emptyMessage = "Nenhum registro encontrado.",
}: DataTableProps<T>): React.JSX.Element {
  const [sort, setSort] = useState<SortState | null>(null);

  const sortedRows: T[] = useMemo(() => {
    if (!sort) return rows;
    const column: Column<T> | undefined = columns.find(
      (c) => c.key === sort.key,
    );
    if (!column?.sortValue) return rows;
    const getValue: (row: T) => string | number = column.sortValue;
    const factor: number = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va: string | number = getValue(a);
      const vb: string | number = getValue(b);
      if (typeof va === "number" && typeof vb === "number")
        return (va - vb) * factor;
      return String(va).localeCompare(String(vb), "pt-BR") * factor;
    });
  }, [rows, columns, sort]);

  const handleSort = (key: string): void => {
    setSort((current) => {
      if (!current || current.key !== key) return { key, direction: "asc" };
      if (current.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  };

  const ariaSort = (key: string): "ascending" | "descending" | "none" => {
    if (sort?.key !== key) return "none";
    return sort.direction === "asc" ? "ascending" : "descending";
  };

  const iconeOrdenacao = (key: string): React.JSX.Element => {
    if (sort?.key !== key)
      return <ChevronsUpDown className="size-3.5 opacity-60" />;
    return sort.direction === "asc" ? (
      <ArrowUp className="size-3.5" />
    ) : (
      <ArrowDown className="size-3.5" />
    );
  };

  const colunasDados: Column<T>[] = columns.filter((c) => !c.acao);
  const colunaAcoes: Column<T> | undefined = columns.find((c) => c.acao);
  const [colunaPrincipal, ...colunasSecundarias] = colunasDados;
  const colunasOrdenaveis: Column<T>[] = colunasDados.filter(
    (c) => c.sortValue,
  );
  const clicavel: boolean = onRowClick !== undefined;

  return (
    <>
      <div className="md:hidden">
        {colunasOrdenaveis.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {colunasOrdenaveis.map((column) => (
              <button
                key={column.key}
                type="button"
                onClick={() => handleSort(column.key)}
                aria-pressed={sort?.key === column.key}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs uppercase tracking-widest outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                  sort?.key === column.key
                    ? "border-foreground/40 text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {column.header}
                {iconeOrdenacao(column.key)}
              </button>
            ))}
          </div>
        )}

        {sortedRows.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <ul className="flex flex-col">
            {sortedRows.map((row) => (
              <li
                key={getRowId(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "group relative flex items-start justify-between gap-3 border-b py-4 pl-3 last:border-b-0",
                  clicavel && "cursor-pointer active:bg-secondary/40",
                )}
              >
                <MarcadorHover />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  {colunaPrincipal && (
                    <div className="min-w-0 text-sm">
                      {colunaPrincipal.render(row)}
                    </div>
                  )}
                  {colunasSecundarias.map((column) => (
                    <div key={column.key} className="text-sm">
                      {column.render(row)}
                    </div>
                  ))}
                </div>
                {colunaAcoes && (
                  <div className="shrink-0">{colunaAcoes.render(row)}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    column.sortValue ? ariaSort(column.key) : undefined
                  }
                  className={cn(
                    "h-11 whitespace-nowrap pr-4 text-xs font-medium uppercase tracking-widest text-muted-foreground first:pl-3",
                    column.acao && "w-12",
                  )}
                >
                  {column.acao ? (
                    <span className="sr-only">{column.header}</span>
                  ) : column.sortValue ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className="inline-flex items-center gap-2 rounded-sm uppercase tracking-widest outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {column.header}
                      {iconeOrdenacao(column.key)}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedRows.map((row) => (
                <tr
                  key={getRowId(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "group h-16 border-b transition-colors last:border-b-0 hover:bg-secondary/40",
                    clicavel && "cursor-pointer",
                  )}
                >
                  {columns.map((column, indice: number) => (
                    <td
                      key={column.key}
                      className={cn(
                        "whitespace-nowrap pr-4",
                        indice === 0 && "relative pl-3",
                      )}
                    >
                      {indice === 0 && <MarcadorHover />}
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
