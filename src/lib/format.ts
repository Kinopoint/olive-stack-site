/** Format a numeric euro amount for display, e.g. 3600 → "€3,600". */
export function euro(amount: number): string {
  return '€' + amount.toLocaleString('en-IE');
}
