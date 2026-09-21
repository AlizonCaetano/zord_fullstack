import { apiFetch } from "@/shared/api";

export type Pessoa = {
  id: number;
  nome: string;
  cpf: string;
};

export type NovoContato = {
  tipo: boolean;
  descricao: string;
};

export type PessoaCriacao = {
  nome: string;
  cpf: string;
  contatos: NovoContato[];
};

export type PessoaAtualizacao = {
  nome: string;
  cpf: string;
};

export function listarPessoas(): Promise<Pessoa[]> {
  return apiFetch<Pessoa[]>("/pessoas");
}

export function criarPessoa(dados: PessoaCriacao): Promise<Pessoa> {
  return apiFetch<Pessoa>("/pessoas", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizarPessoa(
  id: number,
  dados: PessoaAtualizacao,
): Promise<Pessoa> {
  return apiFetch<Pessoa>(`/pessoas/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export function excluirPessoa(id: number): Promise<void> {
  return apiFetch<void>(`/pessoas/${id}`, { method: "DELETE" });
}
