export const site = {
    name: "CurbIQ",
    appName: "Bizzi",
    productName: "Bizzi CurbStrip",
    domain: "https://example.com", // replace later
    email: "hello@curbiq.com" // replace later
  };
  
  export function absoluteUrl(path: string) {
    const base = site.domain.replace(/\/$/, "");
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${base}${p}`;
  }
  