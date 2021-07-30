export function isPositiveInt(val: string): boolean {
  return /^\d+$/.test(val);
}

export function isPositiveNumber(val: string): boolean {
  return /^\d+([.,]\d+)?$/.test(val);
}
