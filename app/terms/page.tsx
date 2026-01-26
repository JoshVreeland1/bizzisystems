import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms | CurbIQ",
  description: "Terms of use for CurbIQ and Bizzi.",
  openGraph: {
    title: "Terms | CurbIQ",
    url: absoluteUrl("/terms")
  }
};

export default function TermsPage() {
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
      <h1 style={styles.h1}>Terms of Use</h1>

      <p style={styles.p}>
        By accessing or using this website, you agree to these Terms of Use.
        This site provides informational content about CurbIQ, Bizzi, and the
        Bizzi CurbStrip.
      </p>

      <h2 style={styles.h2}>No warranties</h2>
      <p style={styles.p}>
        All content is provided “as is” without warranties of any kind.
        Product descriptions, features, and timelines may change without notice.
      </p>

      <h2 style={styles.h2}>No guarantees</h2>
      <p style={styles.p}>
        Information on this site does not constitute an offer, commitment,
        or guarantee of product availability, pricing, or performance.
      </p>

      <h2 style={styles.h2}>Limitation of liability</h2>
      <p style={styles.p}>
        To the maximum extent permitted by law, CurbIQ shall not be liable for
        any direct, indirect, incidental, or consequential damages arising from
        use of this site or reliance on its content.
      </p>

      <h2 style={styles.h2}>Intellectual property</h2>
      <p style={styles.p}>
        All content, trademarks, and materials are the property of CurbIQ
        unless otherwise stated. Unauthorized use is prohibited.
      </p>

      <h2 style={styles.h2}>Governing law</h2>
      <p style={styles.p}>
        These terms are governed by the laws of the applicable jurisdiction
        in which CurbIQ operates, without regard to conflict-of-law principles.
      </p>

      <h2 style={styles.h2}>Contact</h2>
      <p style={styles.p}>
        Questions regarding these terms may be sent to the email address listed
        in the site footer.
      </p>
    </section>
  );
}
