import { clearToken, getToken } from "@/auth/session";

const BASE_URL = "/api";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = "ApiError";
    this.status = status;
  }
}

type CorpoErro = {
  erro?: string;
  message?: string;
};

async function extrairMensagem(resposta: Response): Promise<string> {
  try {
    const corpo: CorpoErro = await resposta.json();
    return corpo.erro ?? corpo.message ?? "Erro inesperado.";
  } catch {
    return "Erro inesperado.";
  }
}

export async function apiFetch<T>(
  caminho: string,
  init: RequestInit = {},
): Promise<T> {
  const token: string | null = getToken();

  const resposta: Response = await fetch(`${BASE_URL}${caminho}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (resposta.status === 401) {
    clearToken();
    window.location.assign("/login");
    throw new ApiError(401, "Sessão expirada.");
  }

  if (!resposta.ok) {
    throw new ApiError(resposta.status, await extrairMensagem(resposta));
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  return (await resposta.json()) as T;
}
