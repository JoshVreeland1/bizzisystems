import type { Metadata } from "next";
import InquiryForm from "@/components/civic/InquiryForm";
export const metadata: Metadata = {
  title: "Waitlist",
  description:
    "Request updates on Bizzi’s planned parking service and driver map.",
};
export default function WaitlistPage() {
  return (
    <section className="b-form-page">
      <h1>Join the waitlist.</h1>
      <p>
        Request updates about the planned turnkey parking service and driver
        map. Share your city so we know where you’re interested.
      </p>
      <InquiryForm kind="waitlist" />
    </section>
  );
}
