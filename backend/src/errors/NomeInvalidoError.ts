export class NomeInvalidoError extends Error {
  constructor() {
    super("Nome inválido");
    this.name = "NomeInvalidoError";
  }
}
