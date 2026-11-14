import Link from "next/link";
export default function Footer() {
  return (
    <footer className="b-site-footer">
      <div className="b-shell b-site-footer-inner">
        <div>
          <strong>BIZZI SYSTEMS, INC.</strong>
          <div>Parking sensors, facility data and planned driver guidance.</div>
          <div>© {new Date().getFullYear()} Bizzi Systems, Inc.</div>
        </div>
        <div className="b-site-footer-links">
          <Link href="/login">Invited operator login ↗</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
