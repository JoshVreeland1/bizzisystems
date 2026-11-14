import Link from "next/link";
import Image from "next/image";
const links=[["Platform","/#platform"],["Applications","/#applications"],["Validation","/#validation"],["Team","/team"],["Contact","/contact"]] as const;
export default function Nav(){
return <header className="b-header"><div className="b-header-inner">
 <Link href="/" className="b-brand" aria-label="Bizzi Systems home"><Image src="/brand/bizzi-logo.png" alt="" width={39} height={39} priority/><span className="b-brand-name">BIZZI<br/>SYSTEMS</span></Link>
 <nav className="b-nav" aria-label="Main navigation">{links.map(([label,href])=><Link key={label} href={href}>{label}</Link>)}</nav>
 <div className="b-actions"><Link className="b-btn b-btn-ghost" href="https://bizzi-pilot-platform.vercel.app/login">Log in</Link><Link className="b-btn b-btn-primary" href="/contact?topic=deployment">Discuss a deployment <span className="b-arrow" aria-hidden="true">↗</span></Link></div>
 </div></header>
}
