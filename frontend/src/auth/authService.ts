import { apiFetch } from "@/shared/api";

type LoginResposta = {
  token: string;
};

export async function login(usuario: string, senha: string): Promise<string> {
  const resposta: LoginResposta = await apiFetch<LoginResposta>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ usuario, senha }),
  });
  return resposta.token;
}
