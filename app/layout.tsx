import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "Bizzi Systems | Parking infrastructure",
    template: "%s | Bizzi Systems",
  },
  description:
    "Camera-free, wire-free parking sensing. Explore Bizzi’s planned turnkey system for parking operators and driver guidance.",
  openGraph: {
    title: "Bizzi Systems",
    description:
      "Parking sensing and planned facility-wide data for operators.",
    url: site.domain,
    siteName: "Bizzi Systems",
    type: "website",
  },
  robots: { index: true, follow: true },
};
export const viewport = { width: "device-width", initialScale: 1 };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
