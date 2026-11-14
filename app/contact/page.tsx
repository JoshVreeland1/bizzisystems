import type { Metadata } from "next";
import ContactClient from "./ContactClient";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request a call about Bizzi parking sensors, facility data and planned deployments.",
};
export default function ContactPage() {
  return <ContactClient />;
}
