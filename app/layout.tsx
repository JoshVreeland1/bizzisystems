import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site, absoluteUrl } from "@/lib/seo";

const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} | ${site.appName} + ${site.productName}`,
    template: `%s | ${site.name}`
  },
  description:
    "Bizzi delivers real-time parking availability using curbside occupancy detection via the Bizzi CurbStrip, helping cities and drivers reduce cruising and improve curb economics.",
  openGraph: {
    title: `${site.name} | ${site.appName} + ${site.productName}`,
    description:
      "Smart city parking made measurable: real-time on-street occupancy, curbside availability, and pricing analytics.",
    url: absoluteUrl("/"),
    siteName: site.name,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.appName} + ${site.productName}`,
    description:
      "Real-time parking availability via curbside occupancy detection and on-street parking sensors."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const styles: Record<string, React.CSSProperties> = {
    page: {
      fontFamily: "var(--font-body)",
      color: "#111",
      background: "#fff",
      minHeight: "100vh"
    },
    main: {
      maxWidth: 1120,
      margin: "0 auto",
      padding: "0 20px"
    },
    smooth: {
      scrollBehavior: "smooth"
    }
  };

  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`} style={styles.smooth}>
      <body style={styles.page}>
        <Nav />
        <main style={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
