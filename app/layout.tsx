import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/seo";

const inter = Inter({subsets:["latin"],variable:"--font-body",display:"swap"});
export const metadata: Metadata = {
 metadataBase:new URL(site.domain),
 title:{default:"Bizzi Systems | Parking infrastructure",template:"%s | Bizzi Systems"},
 description:"Camera-free vehicle counting infrastructure in development for controlled parking lanes.",
 openGraph:{title:"Bizzi Systems",description:"Vehicle counting infrastructure for parking operators.",url:site.domain,siteName:"Bizzi Systems",type:"website"},
 robots:{index:true,follow:true}
};
export const viewport={width:"device-width",initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en" className={inter.variable}><body><Nav/><main id="main-content">{children}</main><Footer/></body></html>;
}
