// lib/seo.ts

export const site = {
  name: "Bizzi Systems",
  appName: "Bizzi",
  productName: "Bizzi CurbStrip",
  domain: "https://www.bizzisystems.com", // replace later
  email: "josh@bizzisystems.com" // replace later
};

export function absoluteUrl(path: string) {
  const base = site.domain.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
