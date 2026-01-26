import type { MetadataRoute } from "next";
import { site } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = site.domain.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/"
      }
    ],
    sitemap: `${base}/sitemap.xml`
  };
}
