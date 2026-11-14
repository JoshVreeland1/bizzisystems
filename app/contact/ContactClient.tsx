import InquiryForm from "@/components/civic/InquiryForm";
export default function ContactClient() {
  return (
    <section className="b-form-page">
      <h1>Discuss your deployment.</h1>
      <p>
        Tell us about your lots, garages or curbside spaces. Request a call to
        discuss your data needs and where Bizzi could fit.
      </p>
      <InquiryForm kind="deployment" />
    </section>
  );
}
