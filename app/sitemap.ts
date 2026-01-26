// app/sitemap.ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.domain.replace(/\/$/, "");

  const pages = [
    "",
    "/team",
    "/contact",
    "/privacy",
    "/terms"
  ];

  return pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date()
  }));
}
