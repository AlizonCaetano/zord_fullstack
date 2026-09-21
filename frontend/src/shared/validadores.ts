const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONE_CARACTERES_REGEX: RegExp = /^[\d\s()+-]+$/;
const TELEFONE_DIGITOS_REGEX: RegExp = /^[1-9]\d{9,10}$/;
const NOME_REGEX: RegExp = /^[\p{L} ]+$/u;
const CPF_REPETIDO_REGEX: RegExp = /^(\d)\1{10}$/;

export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function validarNome(nome: string): boolean {
  const limpo: string = nome.trim();
  return limpo.length >= 4 && limpo.length <= 50 && NOME_REGEX.test(limpo);
}

function digitoVerificador(base: string, pesoInicial: number): number {
  let soma: number = 0;
  for (let i: number = 0; i < base.length; i++) {
    soma += Number(base[i]) * (pesoInicial - i);
  }
  const resto: number = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

export function validarCpf(valor: string): boolean {
  const cpf: string = somenteDigitos(valor);
  if (cpf.length !== 11 || CPF_REPETIDO_REGEX.test(cpf)) {
    return false;
  }
  return (
    digitoVerificador(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    digitoVerificador(cpf.slice(0, 10), 11) === Number(cpf[10])
  );
}

export function formatarCpf(valor: string): string {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function validarEmail(valor: string): boolean {
  return EMAIL_REGEX.test(valor.trim());
}

export function validarTelefone(valor: string): boolean {
  if (!TELEFONE_CARACTERES_REGEX.test(valor)) {
    return false;
  }
  return TELEFONE_DIGITOS_REGEX.test(somenteDigitos(valor));
}
