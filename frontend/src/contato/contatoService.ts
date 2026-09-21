import { apiFetch } from "@/shared/api";

export type PessoaResumo = {
  id: number;
  nome: string;
  cpf: string;
};

export type Contato = {
  id: number;
  tipo: boolean;
  descricao: string;
  pessoa: PessoaResumo;
};

export type ContatoCriacao = {
  idPessoa: number;
  tipo: boolean;
  descricao: string;
};

export type ContatoAtualizacao = {
  descricao: string;
};

export function listarContatos(): Promise<Contato[]> {
  return apiFetch<Contato[]>("/contatos");
}

export function criarContato(dados: ContatoCriacao): Promise<Contato> {
  return apiFetch<Contato>("/contatos", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarContato(
  id: number,
  dados: ContatoAtualizacao,
): Promise<Contato> {
  return apiFetch<Contato>(`/contatos/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export function excluirContato(id: number): Promise<void> {
  return apiFetch<void>(`/contatos/${id}`, { method: "DELETE" });
}
