export class ContatoInvalidoError extends Error {
  constructor() {
    super("Descrição do contato inválida para o tipo informado.");
    this.name = "ContatoInvalidoError";
  }
}
