import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/auth/authService";
import { setToken } from "@/auth/session";
import { ApiError } from "@/shared/api";
import { Wordmark } from "@/shared/Wordmark";

export function LoginPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<boolean>(false);

  const enviar = async (evento: FormEvent<HTMLFormElement>): Promise<void> => {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const token: string = await login(usuario, senha);
      setToken(token);
      navigate("/pessoas", { replace: true });
    } catch (e) {
      if (e instanceof ApiError) {
        setErro(e.status === 401 ? "Usuário ou senha inválidos." : e.message);
      } else {
        setErro("Não foi possível conectar ao servidor.");
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="ambient flex min-h-svh items-center justify-center p-4">
      <div className="glass-panel w-full max-w-sm rounded-md p-8">
        <div className="mb-1 flex justify-center">
          <Wordmark />
        </div>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Entre para acessar a agenda
        </p>

        <form onSubmit={enviar} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="usuario" className="text-sm text-muted-foreground">
              Usuário
            </label>
            <Input
              id="usuario"
              value={usuario}
              onChange={(evento) => setUsuario(evento.target.value)}
              placeholder="seu usuário"
              autoComplete="username"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="senha" className="text-sm text-muted-foreground">
              Senha
            </label>
            <Input
              id="senha"
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              placeholder="sua senha"
              autoComplete="current-password"
              required
            />
          </div>

          {erro && (
            <p role="alert" className="text-sm text-brand-red">
              {erro}
            </p>
          )}

          <Button type="submit" disabled={enviando} className="mt-2 w-full">
            {enviando ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
