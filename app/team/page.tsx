// app/team/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Team | CurbIQ",
  description:
    "Meet the team building Bizzi and the Bizzi CurbStrip: smart city parking, curbside occupancy detection, and real-time parking availability.",
  openGraph: {
    title: "Team | CurbIQ",
    description:
      "Meet the team building Bizzi and the Bizzi CurbStrip for real-time curbside occupancy detection.",
    url: "/team",
    type: "website"
  }
};

type CropSettings = {
  zoom: number; // 1.0–1.25
  x: number; // 0–100 (higher = crop more to the right)
  y: number; // 0–100
};

type TeamMember = {
  name: string;
  role: string;
  image: string;
  crop: CropSettings;
  bio: string;
  tags: string[];
  email: string;
  linkedinUrl: string;
};

export default function TeamPage() {
  const styles: Record<string, React.CSSProperties> = {
    page: { padding: "72px 18px 80px", background: "#fff" },
    container: { maxWidth: 1100, margin: "0 auto" },

    heading: {
      fontSize: 46,
      lineHeight: 1.05,
      letterSpacing: "-0.03em",
      margin: 0,
      color: "#0b0b0c"
    },
    sub: {
      marginTop: 14,
      fontSize: 16,
      lineHeight: 1.7,
      color: "#333",
      maxWidth: 760
    },

    grid: {
      marginTop: 40,
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: 18
    },

    card: {
      gridColumn: "span 6",
      border: "1px solid #eee",
      borderRadius: 18,
      background: "#fff",
      padding: 22
    },

    avatarWrap: {
      position: "relative",
      width: 180,
      height: 180,
      borderRadius: "50%",
      overflow: "hidden",
      background: "#f2f2f2",
      marginBottom: 16
    },

    // ✅ NEW: inner layer handles zoom reliably (Image stays untransformed)
    avatarInner: {
      position: "absolute",
      inset: 0
    },

    role: {
      margin: 0,
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#666",
      fontWeight: 800
    },
    name: {
      margin: "8px 0 6px",
      fontSize: 18,
      fontWeight: 900,
      color: "#0b0b0c"
    },

    contactRow: {
      marginTop: 10,
      display: "flex",
      flexWrap: "wrap",
      gap: 10
    },
    contactPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 10px",
      borderRadius: 999,
      border: "1px solid #e9e9e9",
      background: "#fafafa",
      textDecoration: "none",
      color: "#111",
      fontWeight: 800,
      fontSize: 12
    },
    icon: { width: 16, height: 16 },

    bio: { marginTop: 14, fontSize: 14, lineHeight: 1.7, color: "#2a2a2a" },

    chips: { marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 },
    chip: {
      fontSize: 12,
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #e9e9e9",
      background: "#fafafa",
      color: "#333",
      fontWeight: 700
    },

    ctaRow: {
      marginTop: 40,
      display: "flex",
      gap: 10
    },
    btn: {
      padding: "12px 16px",
      borderRadius: 999,
      border: "1px solid #111",
      background: "#111",
      color: "#fff",
      textDecoration: "none",
      fontWeight: 900,
      fontSize: 13,
      textTransform: "uppercase"
    },
    btnGhost: {
      padding: "12px 16px",
      borderRadius: 999,
      border: "1px solid #2563EB",
      background: "#2563EB",
      color: "#fff",
      textDecoration: "none",
      fontWeight: 900,
      fontSize: 13,
      textTransform: "uppercase"
    }
  };

  const team: TeamMember[] = [
    {
      name: "Josh Vreeland",
      role: "Founder & Chief Executive Officer",
      image: "/team/josh.png",
      // ✅ move RIGHT by increasing x (try 70 → 80 → 90)
      // ✅ if you want "more crop", increase zoom too (1.10–1.20)
      crop: { zoom: 1.11, x: 50, y: 80 },
      email: "josh@curbiqsystems.com",
      linkedinUrl: "https://www.linkedin.com/in/josh-vreeland-77306a2bb/",
      bio:
        "Josh brings a background in economics from the University of Texas at Austin, experience building full-stack programs, and has spent the past few years in the legal field. Josh leads CurbIQ’s vision, strategy, and execution, overseeing product direction, partnerships, and deployment strategy.",
      tags: ["Vision", "Long-Term Strategy", "Partnerships", "Execution Oversight"]
    },
    {
      name: "Ryker Purdy",
      role: "Co-Founder & Chief Business Officer",
      image: "/team/ryker.png",
      crop: { zoom: 1.5, x: 55, y: 20 },
      email: "ryker@curbiqsystems.com",
      linkedinUrl: "https://www.linkedin.com/in/ryker-purdy-7137b1309/",
      bio:
        "Ryker brings a strong background in finance and investment analysis from Hamilton College, with experience conducting equity research and supporting portfolio decisions at an investment firm managing over $2B in assets. He has also led and mentored teams, managing a $2.3M student-run investment portfolio with a long-standing record of disciplined, long-term performance. Ryker leads fundraising, city partnerships, and long-term economic strategy for CurbIQ.",
      tags: ["Capital Strategy", "Fundraising", "Economic Analysis", "Strategic Planning"]
    }
  ];

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Team</h1>
        <p style={styles.sub}>
          We’re building Bizzi and the Bizzi CurbStrip to make parking efficient.
        </p>

        <section style={styles.grid}>
          {team.map((m) => {
            const zoom = clamp(m.crop.zoom, 1, 1.3);
            const x = clamp(m.crop.x, 0, 100);
            const y = clamp(m.crop.y, 0, 100);

            return (
              <article key={m.name} style={styles.card}>
                <div style={styles.avatarWrap}>
                  {/* ✅ Crop/zoom happens HERE, not on the Image */}
                  <div
                    style={{
                      ...styles.avatarInner,
                      transform: `scale(${zoom})`,
                      transformOrigin: `${x}% ${y}%`
                    }}
                  >
                    <Image
                      src={m.image}
                      alt={`${m.name} headshot`}
                      fill
                      style={{ objectFit: "cover" }}
                      unoptimized
                    />
                  </div>
                </div>

                <p style={styles.role}>{m.role}</p>
                <h2 style={styles.name}>{m.name}</h2>

                <div style={styles.contactRow}>
                  <a style={styles.contactPill} href={`mailto:${m.email}`}>
                    <MailIcon style={styles.icon} />
                    Email
                  </a>
                  <a
                    style={styles.contactPill}
                    href={m.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkedInIcon style={styles.icon} />
                    LinkedIn
                  </a>
                </div>

                <p style={styles.bio}>{m.bio}</p>

                <div style={styles.chips}>
                  {m.tags.map((t) => (
                    <span key={t} style={styles.chip}>
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </section>

        <div style={styles.ctaRow}>
          <Link href="/contact" style={styles.btn}>
            Contact
          </Link>
          <Link href="/investors" style={styles.btnGhost}>
            Become an Investor
          </Link>
        </div>
      </div>
    </main>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function MailIcon({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path
        fill="currentColor"
        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5z"
      />
    </svg>
  );
}

function LinkedInIcon({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path
        fill="currentColor"
        d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.3 18H6V9h2.3v9zM7.1 7.7A1.3 1.3 0 1 1 7.1 5a1.3 1.3 0 0 1 0 2.7zM18 18h-2.3v-4.3c0-1-.4-1.7-1.4-1.7-.8 0-1.2.5-1.4 1v5H10V9h2.2v1.2c.3-.5 1-1.2 2.3-1.2 1.6 0 3 1 3 3.4V18z"
      />
    </svg>
  );
}
