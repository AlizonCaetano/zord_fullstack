export class ContatoNaoEncontradoError extends Error {
  constructor() {
    super("Contato não encontrado");
    this.name = "ContatoNaoEncontradoError";
  }
}
