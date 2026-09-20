export class LimiteContatoExcedidoError extends Error {
  constructor() {
    super("Limite de 5 contatos deste tipo já atingido");
    this.name = "LimiteContatoExcedidoError";
  }
}
