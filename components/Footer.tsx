import Link from "next/link";
import { site } from "@/lib/seo";

export default function Footer() {
  const styles: Record<string, React.CSSProperties> = {
    wrap: {
      borderTop: "1px solid #eee",
      marginTop: 56,
      background: "#fff"
    },
    inner: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: "30px 20px",
      display: "flex",
      justifyContent: "space-between",
      gap: 24,
      flexWrap: "wrap"
    },
    col: {
      minWidth: 220
    },
    title: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: 10
    },
    link: {
      display: "block",
      fontSize: 14,
      color: "#111",
      opacity: 0.85,
      padding: "6px 0",
      textDecoration: "none"
    },
    meta: {
      fontSize: 14,
      color: "#333",
      lineHeight: 1.6
    },
    small: {
      fontSize: 12,
      color: "#777",
      paddingTop: 14
    },
    contactLink: {
      display: "inline-block",
      marginTop: 6,
      fontSize: 14,
      fontWeight: 700,
      color: "#111",
      textDecoration: "underline",
      cursor: "pointer"
    }
  };

  // 🔑 Email config
  const CONTACT_EMAILS = [
    "josh@curbiqsystems.com",
    "ryker@curbiqsystems.com"
  ].join(",");

  const SUBJECT = encodeURIComponent("Inquiry about CurbIQ / Bizzi");
  const BODY = encodeURIComponent(
    "Hi Josh and Ryker,\n\n" +
    "I’m reaching out regarding CurbIQ.\n\n"
  );

  const MAILTO = `mailto:${CONTACT_EMAILS}?subject=${SUBJECT}&body=${BODY}`;

  return (
    <footer style={styles.wrap}>
      <div style={styles.inner}>
        <div style={styles.col}>
          <div style={styles.title}>{site.name}</div>
          <div style={styles.meta}>
            {site.appName} maps curbside availability with real-time parking
            occupancy signals from the {site.productName}.<br />
            <span style={styles.small}>
              Smart city parking • curbside occupancy detection • real-time parking availability
            </span>
          </div>
        </div>

        <div style={styles.col}>
          <div style={styles.title}>Explore</div>
          <Link href="/investors" style={styles.link}>
            Become an Investor
          </Link>
          <Link href="/waitlist" style={styles.link}>
            Join the Waitlist
          </Link>
          <Link href="/privacy" style={styles.link}>
            Privacy
          </Link>
          <Link href="/terms" style={styles.link}>
            Terms
          </Link>
        </div>

        <div style={styles.col}>
          <div style={styles.title}>Contact</div>
            <a href={MAILTO} style={styles.contactLink}>
              Email CurbIQ
            </a>
            <br />
            <span style={styles.small}>
              For investors, please include your firm, focus, and timeline.
            </span>
          </div>
        </div>
    </footer>
  );
}
