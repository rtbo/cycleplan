export function isPositiveInt(val: string): boolean {
  return /^\d+$/.test(val);
}

export function isPositiveNumber(val: string): boolean {
  return /^\d+([.,]\d+)?$/.test(val);
}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
