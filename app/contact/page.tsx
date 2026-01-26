// app/contact/page.tsx
import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact | CurbIQ",
  description:
    "Contact CurbIQ about Bizzi and the Bizzi CurbStrip. Partnerships, pilots, city deployments, and investor inquiries."
};

export default function ContactPage() {
  return <ContactClient />;
}
