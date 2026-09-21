import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  emptyMessage?: string;
};

type SortState = {
  key: string;
  direction: "asc" | "desc";
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={column.sortValue ? ariaSort(column.key) : undefined}
                className="h-11 pr-4 text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                {column.sortValue ? (
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className="inline-flex items-center gap-2 rounded-sm uppercase tracking-widest outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {column.header}
                    {sort?.key === column.key ? (
                      sort.direction === "asc" ? (
                        <ArrowUp className="size-3.5" />
                      ) : (
                        <ArrowDown className="size-3.5" />
                      )
                    ) : (
                      <ChevronsUpDown className="size-3.5 opacity-60" />
                    )}
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
                className="h-16 border-b transition-colors last:border-b-0 hover:bg-secondary/50"
              >
                {columns.map((column) => (
                  <td key={column.key} className="pr-4">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
