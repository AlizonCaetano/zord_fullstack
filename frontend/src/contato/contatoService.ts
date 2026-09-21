import { apiFetch } from "@/shared/api";

export type Contato = {
  id: number;
  tipo: boolean;
  descricao: string;
  idPessoa: number;
};

export type ContatoEntrada = {
  tipo: boolean;
  descricao: string;
  idPessoa: number;
};

export function listarContatos(): Promise<Contato[]> {
  return apiFetch<Contato[]>("/contatos");
}

export function criarContato(dados: ContatoEntrada): Promise<Contato> {
  return apiFetch<Contato>("/contatos", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarContato(
  id: number,
  dados: ContatoEntrada,
): Promise<Contato> {
  return apiFetch<Contato>(`/contatos/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export function excluirContato(id: number): Promise<void> {
  return apiFetch<void>(`/contatos/${id}`, { method: "DELETE" });
}
