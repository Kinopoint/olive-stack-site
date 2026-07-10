/** URL-safe slug from a display name, e.g. "St John\u2019s and St Mary\u2019s" -> "st-john-s-and-st-mary-s". */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
