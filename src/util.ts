export function isPositiveInt(val: string): boolean {
  return /^\d+$/.test(val);
}

export function isPositiveNumber(val: string): boolean {
  return /^\d+([.,]\d+)?$/.test(val);
}

export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function pointsToSvgPath(points: number[]): string {
  if (points.length < 4) throw new Error("Path must have at least 4 coords");
  if (points.length % 2 !== 0) throw new Error("Odd number of path coords");

  let path = `M ${points[0]} ${points[1]}`;
  let i = 2;
  while (i < points.length) {
    path = path.concat(` L ${points[i]} ${points[i + 1]}`);
    i += 2;
  }
  return path;
}
