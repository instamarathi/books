const artModules = import.meta.glob("/books/*/images/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export function chapterArtUrl(
  bookSlug: string,
  chapterSlug: string,
): string | undefined {
  return artModules[`/books/${bookSlug}/images/${chapterSlug}.webp`];
}
