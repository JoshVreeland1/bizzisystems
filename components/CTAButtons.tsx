import Link from "next/link";

type Props = {
  primaryHref: string;
  primaryText: string;
  secondaryHref: string;
  secondaryText: string;
};

export default function CTAButtons(props: Props) {
  const styles: Record<string, React.CSSProperties> = {
    row: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      alignItems: "center"
    },

    // ✅ These flex rules keep desktop identical but make mobile buttons stack cleanly.
    primary: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 16px",
      borderRadius: 999,
      background: "#2563EB",
      color: "#fff",
      border: "1px solid #2563EB",
      fontSize: 14,
      fontWeight: 600,
      transition: "transform 160ms ease, opacity 160ms ease",
      textDecoration: "none",
      flex: "1 1 200px",
      minHeight: 44
    },
    secondary: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 16px",
      borderRadius: 999,
      background: "#111",
      color: "#fff",
      border: "1px solid #111",
      fontSize: 14,
      fontWeight: 600,
      transition: "transform 160ms ease, opacity 160ms ease",
      textDecoration: "none",
      flex: "1 1 200px",
      minHeight: 44
    }
  };

  return (
    <div style={styles.row}>
      <Link href={props.primaryHref} style={styles.primary}>
        {props.primaryText}
      </Link>
      <Link href={props.secondaryHref} style={styles.secondary}>
        {props.secondaryText}
      </Link>
    </div>
  );
}
