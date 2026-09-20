export class CpfDuplicadoError extends Error {
  constructor() {
    super("CPF já cadastrado");
    this.name = "CpfDuplicadoError";
  }
}
