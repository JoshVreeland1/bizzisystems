import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Investors",
  description:
    "Contact CurbIQ to discuss investing in Bizzi and the Bizzi CurbStrip: real-time parking availability and curbside occupancy detection.",
  openGraph: {
    title: "Investors",
    description:
      "Become an Investor / Contact Us about Bizzi and the Bizzi CurbStrip.",
    url: absoluteUrl("/investors")
  }
};

export default function InvestorsPage() {
  const styles: Record<string, React.CSSProperties> = {
    wrap: { padding: "56px 0" },
    h1: {
      fontFamily: "var(--font-heading)",
      fontSize: 44,
      letterSpacing: "-0.04em",
      margin: 0
    },
    sub: {
      marginTop: 12,
      fontSize: 16,
      lineHeight: 1.7,
      color: "#222",
      maxWidth: 720
    },
    card: {
      marginTop: 22,
      border: "1px solid #eee",
      borderRadius: 22,
      background: "#fff",
      padding: 20,
      maxWidth: 760
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    },
    label: {
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      fontWeight: 900,
      color: "#666",
      marginBottom: 8
    },
    input: {
      width: "100%",
      padding: "12px 12px",
      borderRadius: 12,
      border: "1px solid #ddd",
      fontSize: 14
    },
    textarea: {
      width: "100%",
      padding: "12px 12px",
      borderRadius: 12,
      border: "1px solid #ddd",
      fontSize: 14,
      minHeight: 120,
      resize: "vertical"
    },
    row: { marginTop: 12 },
    checkboxRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 12
    },
    button: {
      marginTop: 14,
      padding: "12px 16px",
      borderRadius: 999,
      border: "1px solid #111",
      background: "#111",
      color: "#fff",
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer"
    },
    note: {
      marginTop: 12,
      fontSize: 13,
      color: "#555",
      lineHeight: 1.6
    }
  };

  return (
    <section style={styles.wrap}>
      <h1 style={styles.h1}>Become an Investor</h1>

      <div style={styles.card}>
        <form method="post" action="/api/investor">
          <div style={styles.grid}>
            <div>
              <div style={styles.label}>Name</div>
              <input name="name" required style={styles.input} />
            </div>
            <div>
              <div style={styles.label}>Email</div>
              <input name="email" type="email" required style={styles.input} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.label}>Organization</div>
            <input name="organization" required style={styles.input} />
          </div>

          <div style={styles.row}>
            <div style={styles.label}>Message</div>
            <textarea name="message" required style={styles.textarea} />
          </div>

          <div style={styles.checkboxRow}>
            <input id="accredited" name="accredited" type="checkbox" />
            <label htmlFor="accredited" style={{ fontSize: 14, color: "#222" }}>
              I am an accredited investor
            </label>
          </div>

          <button style={styles.button} type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
}
