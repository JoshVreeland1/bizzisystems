// app/contact/page.tsx
import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact | Bizzi Systems",
  description:
    "Contact Bizzi Systems about Bizzi and the Bizzi CurbStrip. Partnerships, pilots, city deployments, and investor inquiries."
};

export default function ContactPage() {
  return <ContactClient />;
}

