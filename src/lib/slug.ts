export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function generateUniqueSlug(
  baseName: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(baseName) || "business";
  let slug = base;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}
