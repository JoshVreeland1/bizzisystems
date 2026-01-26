// app/page.tsx
import Script from "next/script";
import CTAButtons from "@/components/CTAButtons";
import Section from "@/components/Section";
import DemoLoop from "@/components/DemoLoop";
import FaqAccordion from "@/components/FaqAccordion";
import { site, absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bizzi makes curb parking measurable",
  description:
    "Bizzi Systems builds Bizzi and the Bizzi CurbStrip to deliver real-time parking availability, curbside occupancy detection, and smarter curb economics for cities and drivers.",
  openGraph: {
    title: "Bizzi makes curb parking measurable",
    description:
      "Real-time parking availability and curbside occupancy detection for smart city parking.",
    url: absoluteUrl("/")
  }
};

export default function HomePage() {
  const styles: Record<string, React.CSSProperties> = {
    hero: {
      padding: "72px 0 56px 0"
    },
    heroGrid: {
      display: "grid",
      gridTemplateColumns: "1.1fr 0.9fr",
      gap: 24,
      alignItems: "center"
    },
    h1: {
      fontFamily: "var(--font-heading)",
      fontSize: 52,
      lineHeight: 1.05,
      margin: 0,
      letterSpacing: "-0.04em"
    },
    sub: {
      marginTop: 14,
      fontSize: 17,
      lineHeight: 1.7,
      color: "#222",
      maxWidth: 560
    },
    badgeRow: {
      marginTop: 18,
      display: "flex",
      gap: 10,
      flexWrap: "wrap"
    },
    badge: {
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      border: "1px solid #eee",
      borderRadius: 999,
      padding: "8px 12px",
      background: "#fff"
    },
    rightCard: {
      border: "1px solid #eee",
      borderRadius: 22,
      padding: 22,
      background: "#fff",
      boxShadow: "0 18px 60px rgba(0,0,0,0.06)"
    },
    rightTitle: {
      fontSize: 12,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      fontWeight: 900,
      color: "#666",
      marginBottom: 10
    },
    bullets: {
      margin: 0,
      paddingLeft: 18,
      color: "#222",
      lineHeight: 1.8,
      fontSize: 15
    },
    grid2: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 14,
      marginTop: 18
    },
    card: {
      border: "1px solid #eee",
      borderRadius: 18,
      padding: 16,
      background: "#fcfcfc"
    },
    cardTitle: {
      fontWeight: 900,
      marginBottom: 6
    },
    small: {
      fontSize: 14,
      color: "#333",
      lineHeight: 1.6
    },
    accentBlue: {
      color: "#2563EB",
      fontWeight: 700
    }
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.domain,
    email: site.email,
    brand: site.appName
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: site.productName,
    brand: site.name,
    description:
      "Curbside sensing hardware for on-street parking sensors and real-time occupancy status feeding the Bizzi platform.",
    category: "Smart City Parking",
    url: site.domain
  };

  return (
    <>
      {/* Mobile-only layout fixes (desktop stays identical) */}
      <style>{`
        @media (max-width: 900px) {
          .home-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .home-h1 {
            font-size: 42px !important;
            letter-spacing: -0.035em !important;
          }
          .home-sub {
            max-width: 100% !important;
          }
        }

        @media (max-width: 520px) {
          .home-h1 {
            font-size: 36px !important;
            line-height: 1.08 !important;
          }
          .home-hero {
            padding: 52px 0 40px 0 !important;
          }
          .home-right-card {
            padding: 18px !important;
          }
          .home-bullets {
            font-size: 14px !important;
            line-height: 1.75 !important;
          }
          .home-grid2 {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .home-badge-row {
            gap: 8px !important;
          }
          .home-badge {
            padding: 7px 10px !important;
            font-size: 11px !important;
          }
        }
      `}</style>

      <Script
        id="jsonld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <Script
        id="jsonld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <section style={styles.hero} className="home-hero">
        <div style={styles.heroGrid} className="home-hero-grid">
          <div>
            <h1 style={styles.h1} className="home-h1">
              We are making parking <span style={styles.accentBlue}>easy</span>.
            </h1>

            <p style={styles.sub} className="home-sub">
              Bizzi Systems builds <b>smart city parking</b> infrastructure that turns curb space into a live system:
              <b> curbside occupancy detection</b> powered by the <b>Bizzi CurbStrip</b>, surfaced as{" "}
              <b>real-time parking availability</b> inside the Bizzi app.
            </p>

            <CTAButtons
              primaryHref="/investors"
              primaryText="Become an Investor"
              secondaryHref="/waitlist"
              secondaryText="Join the Waitlist"
            />

            <div style={styles.badgeRow} className="home-badge-row" aria-label="Key keywords">
              <div style={styles.badge} className="home-badge">on-street parking sensors</div>
              <div style={styles.badge} className="home-badge">dynamic curb pricing</div>
              <div style={styles.badge} className="home-badge">real-time availability</div>
            </div>
          </div>

          <div style={styles.rightCard} className="home-right-card">
            <div style={styles.rightTitle}>What you get</div>
            <ul style={styles.bullets} className="home-bullets">
              <li>Real-time parking occupancy in an app</li>
              <li>Cleaner enforcement workflows and better utilization</li>
              <li>Data foundation for pricing, policy, and planning</li>
              <li>Driver experience that reduces cruising and uncertainty</li>
            </ul>

            <div style={styles.grid2} className="home-grid2">
              <div style={styles.card}>
                <div style={styles.cardTitle}>For Cities</div>
                <div style={styles.small}>Visibility, efficiency, and a measurable curb economy.</div>
              </div>
              <div style={styles.card}>
                <div style={styles.cardTitle}>For Drivers</div>
                <div style={styles.small}>Never search for parking again.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Product" title="What we’re building">
        <p>
          <b>Bizzi</b> is the map and experience. <b>Bizzi CurbStrip</b> is the curbside hardware.
          Together, they deliver reliable occupancy signals that unlock real-time availability, analytics,
          and the foundation for smarter curb operations.
        </p>
      </Section>

      <Section eyebrow="Customers" title="Who it’s for">
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
          <li><b>Cities</b>: manage demand, price intelligently, plan with real usage data</li>
          <li><b>Drivers</b>: find parking faster with real-time availability</li>
          <li><b>Universities</b>: reduce congestion and improve utilization</li>
          <li><b>Districts & operators</b>: make curb space predictable and measurable</li>
        </ul>
      </Section>

      <Section eyebrow="Problem" title="What it solves">
        <p>
          Curb parking is often a blind spot. Without accurate occupancy, enforcement and pricing are guesswork,
          drivers cruise longer, and cities lose time and revenue. Bizzi targets those gaps with dependable
          on-street status and a modern interface built around clarity.
        </p>
      </Section>

      <Section eyebrow="Why" title="Why this solution">
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
          <li><b>Fast install</b> and curb-native design</li>
          <li><b>Durable</b> hardware approach built for real streets</li>
          <li><b>Real-time</b> signals to power availability and operations</li>
          <li><b>Lower total cost</b> path versus heavier infrastructure</li>
        </ul>
      </Section>

      <Section eyebrow="Demo" title="See it work: occupancy change → real-time update">
        <DemoLoop />
        <div style={{ marginTop: 16, color: "#555", lineHeight: 1.7 }} />
        <VideoSpecs />
      </Section>

      <Section eyebrow="FAQ" title="Common questions">
        <FaqAccordion />
      </Section>
    </>
  );
}

function VideoSpecs() {
  const styles: Record<string, React.CSSProperties> = {
    box: {
      marginTop: 18,
      border: "1px solid #eee",
      borderRadius: 16,
      background: "#fff",
      padding: 16
    },
    title: {
      fontSize: 12,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      fontWeight: 900,
      color: "#666",
      marginBottom: 10
    },
    list: {
      margin: 0,
      paddingLeft: 18,
      color: "#222",
      lineHeight: 1.85,
      fontSize: 14
    }
  };

  return null;
}
