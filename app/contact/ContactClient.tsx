// app/contact/ContactClient.tsx
"use client";

import { useState } from "react";

export default function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("integration");
  const [message, setMessage] = useState("");

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
      padding: "12px",
      borderRadius: 12,
      border: "1px solid #ddd",
      fontSize: 14
    },
    textarea: {
      width: "100%",
      padding: "12px",
      borderRadius: 12,
      border: "1px solid #ddd",
      minHeight: 140,
      fontSize: 14
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
    }
  };

  function handleSend() {
    const to = "josh@curbiqsystems.com,ryker@curbiqsystems.com";
    const subject = encodeURIComponent(`CurbIQ Contact — ${topic}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

    // reset form after click
    setName("");
    setEmail("");
    setTopic("integration");
    setMessage("");
  }

  return (
    <section style={styles.wrap}>
      <h1 style={styles.h1}>Contact</h1>
      <p style={styles.sub}>We look forward to hearing from you.</p>

      <div style={styles.card}>
        <div style={styles.grid}>
          <div>
            <div style={styles.label}>Name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
          </div>

          <div>
            <div style={styles.label}>Email</div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={styles.label}>Topic</div>
          <select value={topic} onChange={(e) => setTopic(e.target.value)} style={styles.input}>
            <option value="integration">Integration</option>
            <option value="partnership">Partnership</option>
            <option value="funding">Investment</option>
            <option value="media">Media</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={styles.label}>Message</div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.textarea}
          />
        </div>

        <button style={styles.button} onClick={handleSend}>
          Send
        </button>
      </div>
    </section>
  );
}
