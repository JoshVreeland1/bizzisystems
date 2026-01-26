"use client";

import React from "react";

type Item = { q: string; a: string };

const DEFAULT_FAQ: Item[] = [
  {
    q: "What is Bizzi?",
    a: "Bizzi is our mobile app that shows real-time parking availability and supports dynamic curb pricing, analytics, and smoother curb operations."
  },
  {
    q: "What is the Bizzi CurbStrip?",
    a: "Bizzi CurbStrip is the curbside sensing hardware that detects on-street occupancy and streams stall status to the Bizzi platform."
  },
  {
    q: "Who uses this?",
    a: "Cities, campuses, districts, and operators who need accurate curb data for smarter policy, better utilization, improved enforcement workflows, and a cleaner driver experience."
  },
  {
    q: "Why should my city use Bizzi?",
    a: "Because curb space is an asset. When cities can measure occupancy, they can reduce cruising and congestion, improve turnover and access for local businesses, deploy enforcement more efficiently, and make pricing and policy decisions using real data instead of guesswork."
  },
  {
    q: "Is Bizzi free for drivers?",
    a: "Yes. Drivers can use Bizzi to see real-time availability and make parking decisions without paying to access the app."
  },
  {
    q: "How does this help drivers?",
    a: "Less circling, faster arrivals, clearer availability, and fewer surprises. Accurate occupancy means the map reflects what’s actually open, when it matters."
  },
  {
    q: "Why not cameras?",
    a: "Cameras can be expensive to install and maintain, and they raise privacy and operational concerns. The Bizzi CurbStrip is designed to be a simpler curb-native approach that focuses on occupancy status instead of video."
  },
  {
    q: "How do you protect against vandalism?",
    a: "The system is designed to be low-profile and curb-native, with durable materials and mounting that resists prying. If a unit is damaged or removed, the platform can flag anomalies quickly so maintenance is targeted rather than reactive."
  },
  {
    q: "How does it handle heat, UV, rain, and cold?",
    a: "Our CurbStrip is engineered for outdoor conditions: weather-sealed construction, UV-resistant materials, and components selected for wide temperature ranges. The goal is stable performance across sun, rain, cold snaps, and daily thermal cycling."
  }
];

export default function FaqAccordion({ items = DEFAULT_FAQ }: { items?: Item[] }) {
  const [open, setOpen] = React.useState<number | null>(0);

  const styles: Record<string, React.CSSProperties> = {
    list: {
      display: "grid",
      gap: 12,
      marginTop: 16
    },
    item: {
      border: "1px solid #eee",
      borderRadius: 16,
      overflow: "hidden",
      background: "#fff"
    },
    button: {
      width: "100%",
      textAlign: "left",
      padding: "16px 16px",
      border: "none",
      background: "#fff",
      cursor: "pointer",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12
    },
    q: {
      fontSize: 15,
      fontWeight: 800,
      color: "#111"
    },
    icon: {
      width: 28,
      height: 28,
      borderRadius: 999,
      border: "1px solid #eee",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#111",
      fontWeight: 900
    },
    aWrap: {
      padding: "0 16px 16px 16px",
      color: "#333",
      lineHeight: 1.65
    }
  };

  return (
    <div style={styles.list}>
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div key={it.q} style={styles.item}>
            <button
              type="button"
              style={styles.button}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : idx)}
            >
              <span style={styles.q}>{it.q}</span>
              <span style={styles.icon}>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen ? <div style={styles.aWrap}>{it.a}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
