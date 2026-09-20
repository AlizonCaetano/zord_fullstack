export class PessoaNaoEncontradaError extends Error {
  constructor() {
    super("Pessoa não encontrada");
    this.name = "PessoaNaoEncontradaError";
  }
}
