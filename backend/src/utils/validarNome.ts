export function validarNome(nome: string): boolean {
  const regex = /^[A-Za-zÀ-ÿ\s]{4,}$/;
  return regex.test(nome.trim());
}
