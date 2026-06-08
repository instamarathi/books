import { describe, expect, it } from "vitest";
import { buildSitemapXml } from "./generate-sitemap";

describe("buildSitemapXml", () => {
  it("includes the homepage, book pages, and chapter pages under the books base path", () => {
    const xml = buildSitemapXml({
      bookSlugs: ["how-to-talk", "mala-sangaychay"],
      chapters: [
        { bookSlug: "how-to-talk", chapterSlug: "01-feelings" },
        { bookSlug: "mala-sangaychay", chapterSlug: "10-mehendi" },
      ],
      siteOrigin: "https://instamarathi.github.io",
      siteBase: "/books/",
    });

    expect(xml).toContain("<loc>https://instamarathi.github.io/books/</loc>");
    expect(xml).toContain("<loc>https://instamarathi.github.io/books/how-to-talk/</loc>");
    expect(xml).toContain("<loc>https://instamarathi.github.io/books/mala-sangaychay/</loc>");
    expect(xml).toContain("<loc>https://instamarathi.github.io/books/how-to-talk/01-feelings/</loc>");
    expect(xml).toContain("<loc>https://instamarathi.github.io/books/mala-sangaychay/10-mehendi/</loc>");
  });
});
