export class CpfInvalidoError extends Error {
  constructor() {
    super("CPF inválido");
    this.name = "CpfInvalidoError";
  }
}
