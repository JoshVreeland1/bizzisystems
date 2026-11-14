import Link from "next/link";
import Image from "next/image";
const links = [
  ["Platform", "/#platform"],
  ["Markets", "/#markets"],
  ["Validation", "/#validation"],
  ["Team", "/team"],
] as const;
export default function Nav() {
  return (
    <header className="b-header">
      <a className="b-skip" href="#main-content">
        Skip to content
      </a>
      <div className="b-header-inner">
        <Link href="/" className="b-brand" aria-label="Bizzi Systems home">
          <Image
            src="/brand/bizzi-logo.png"
            alt=""
            width={40}
            height={40}
            priority
          />
          <span className="b-brand-name">BIZZI SYSTEMS</span>
        </Link>
        <nav className="b-nav" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="b-actions">
          <Link
            className="b-btn b-btn-primary"
            href="/contact?topic=deployment"
          >
            Discuss a deployment{" "}
            <span className="b-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
