import Link from "next/link";
import { site } from "@/lib/seo";

export default function Nav() {
  const styles: Record<string, React.CSSProperties> = {
    wrap: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid #eee"
    },
    inner: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: "14px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16
    },
    brand: {
      display: "flex",
      alignItems: "baseline",
      gap: 10
    },
    logo: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      fontSize: 18
    },
    sub: {
      fontSize: 12,
      color: "#666"
    },
    links: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      fontSize: 14
    },
    link: {
      color: "#111",
      opacity: 0.85
    },
    linkHover: {
      opacity: 1
    }
  };

  return (
    <header style={styles.wrap}>
      <div style={styles.inner}>
        <Link href="/" style={styles.brand} aria-label={`${site.name} home`}>
          <div style={styles.logo}>{site.name}</div>
        </Link>

        <nav aria-label="Primary" style={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/team">Team</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy" style={styles.link}>Privacy</Link>
          <Link href="/terms" style={styles.link}>Terms</Link>
        </nav>
      </div>
    </header>
  );
}
