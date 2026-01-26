import React from "react";

type Props = {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  id?: string;
};

export default function Section({ eyebrow, title, children, id }: Props) {
  const styles: Record<string, React.CSSProperties> = {
    wrap: {
      padding: "56px 0",
      borderTop: "1px solid #f1f1f1"
    },
    eyebrow: {
      fontSize: 12,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "#666",
      fontWeight: 700,
      marginBottom: 10
    },
    // ✅ Mobile shrinks naturally, desktop stays identical
    title: {
      fontSize: "clamp(26px, 4.2vw, 34px)",
      lineHeight: 1.15,
      margin: 0,
      letterSpacing: "-0.03em"
    },
    body: {
      marginTop: 18,
      fontSize: 16,
      color: "#222",
      lineHeight: 1.7
    }
  };

  return (
    <section id={id} style={styles.wrap}>
      {eyebrow ? <div style={styles.eyebrow}>{eyebrow}</div> : null}
      <h2 style={styles.title}>{title}</h2>
      <div style={styles.body}>{children}</div>
    </section>
  );
}
