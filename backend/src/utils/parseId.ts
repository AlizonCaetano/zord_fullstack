const ID_REGEX: RegExp = /^\d+$/;

export function parseId(valor: string | string[] | undefined): number | null {
  if (typeof valor !== "string" || !ID_REGEX.test(valor)) {
    return null;
  }
  const id: number = Number(valor);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
