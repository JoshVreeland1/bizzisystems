import type { Metadata } from "next";
import { absoluteUrl, site } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Waitlist",
  description:
    "Join the Bizzi waitlist for real-time parking availability. Cities and drivers can request access and updates.",
  openGraph: {
    title: "Waitlist",
    description: "Join the waitlist for Bizzi.",
    url: absoluteUrl("/waitlist")
  }
};

export default function WaitlistPage() {
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
    select: {
      width: "100%",
      padding: "12px 12px",
      borderRadius: 12,
      border: "1px solid #ddd",
      fontSize: 14,
      background: "#fff"
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
      <h1 style={styles.h1}>Join the Waitlist</h1>
      <p style={styles.sub}>
        Get all updates about <b>{site.appName}</b>. If you represent a city or district,
        please share your area and timeline.
      </p>

      <div style={styles.card}>
        <form method="post" action="/api/waitlist">
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

          <div style={{ marginTop: 12 }}>
            <div style={styles.label}>City</div>
            <input name="city" required style={styles.input} />
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={styles.label}>I am</div>
            <select name="audience" required style={styles.select} defaultValue="driver">
              <option value="driver">A driver</option>
              <option value="city">Representing a city</option>
            </select>
          </div>

          <button style={styles.button} type="submit">Submit</button>
        </form>
      </div>
    </section>
  );
}
