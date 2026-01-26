import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy | Bizzi Systems",
  description: "Privacy policy for Bizzi Systems and Bizzi.",
  openGraph: {
    title: "Privacy | Bizzi Systems",
    url: absoluteUrl("/privacy")
  }
};

export default function PrivacyPage() {
  const styles: Record<string, React.CSSProperties> = {
    wrap: { padding: "56px 0", maxWidth: 820, margin: "0 auto" },
    h1: {
      fontFamily: "var(--font-heading)",
      fontSize: 44,
      letterSpacing: "-0.04em",
      margin: 0
    },
    h2: { marginTop: 28, fontSize: 18 },
    p: { marginTop: 14, lineHeight: 1.8, color: "#222" }
  };

  return (
    <section style={styles.wrap}>
      <h1 style={styles.h1}>Privacy Policy</h1>

      <p style={styles.p}>
        Bizzi Systems respects your privacy. This policy explains how information is collected,
        used, and protected when you interact with our website, products, and services.
      </p>

      <h2 style={styles.h2}>Information we collect</h2>
      <p style={styles.p}>
        We collect information you voluntarily provide, including name, email address,
        city, organization, and message content submitted through contact, waitlist,
        or investor forms.
      </p>

      <h2 style={styles.h2}>How we use information</h2>
      <p style={styles.p}>
        Information is used to respond to inquiries, manage pilots and waitlists,
        communicate product updates, and evaluate interest in deployments or partnerships.
      </p>

      <h2 style={styles.h2}>Data sharing</h2>
      <p style={styles.p}>
        We do not sell personal data. Information may be shared with trusted service
        providers solely to operate our systems (e.g., hosting, analytics, email delivery).
      </p>

      <h2 style={styles.h2}>Data security</h2>
      <p style={styles.p}>
        We take reasonable technical and organizational measures to protect information.
        However, no system is completely secure, and submission is at your own risk.
      </p>

      <h2 style={styles.h2}>Policy changes</h2>
      <p style={styles.p}>
        This policy may be updated periodically. Continued use of the site constitutes
        acceptance of any revisions.
      </p>

      <h2 style={styles.h2}>Contact</h2>
      <p style={styles.p}>
        Privacy questions may be directed to the email address listed in the site footer.
      </p>
    </section>
  );
}
