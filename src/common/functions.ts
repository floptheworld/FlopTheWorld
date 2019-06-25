export function roundToPrecision(x: number, precision: number) {
  const y = +x + (precision === undefined ? 0.5 : precision / 2);
  return y - (y % (precision === undefined ? 1 : +precision));
}
