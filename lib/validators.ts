export function isEmail(s: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
  }
  
  export function clampString(s: string, max: number) {
    const v = (s ?? "").toString().trim();
    return v.length > max ? v.slice(0, max) : v;
  }
  
  export function requiredString(s: unknown, max = 200) {
    const v = clampString(String(s ?? ""), max);
    if (!v) return null;
    return v;
  }
  
  export function optionalString(s: unknown, max = 500) {
    const v = clampString(String(s ?? ""), max);
    return v ? v : null;
  }
  