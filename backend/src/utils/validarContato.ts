const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONE_CARACTERES_REGEX: RegExp = /^[\d\s()+-]+$/;
const TELEFONE_DIGITOS_REGEX: RegExp = /^[1-9]\d{9,10}$/;

export function validarEmail(valor: string): boolean {
  return EMAIL_REGEX.test(valor.trim());
}

export function validarTelefone(valor: string): boolean {
  if (!TELEFONE_CARACTERES_REGEX.test(valor)) {
    return false;
  }
  const digitos: string = valor.replace(/\D/g, "");
  return TELEFONE_DIGITOS_REGEX.test(digitos);
}

export function validarDescricaoContato(
  tipo: boolean,
  descricao: string,
): boolean {
  return tipo ? validarEmail(descricao) : validarTelefone(descricao);
}
