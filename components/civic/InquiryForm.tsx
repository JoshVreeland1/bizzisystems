"use client";
import { FormEvent, useState } from "react";
import { site } from "@/lib/seo";
export default function InquiryForm({
  kind,
}: {
  kind: "deployment" | "waitlist";
}) {
  const [prepared, setPrepared] = useState(false);
  const waitlist = kind === "waitlist";
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = Array.from(data.entries())
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(waitlist ? "Bizzi waitlist request" : "Bizzi deployment call request")}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  }
  return (
    <form
      className="b-form"
      onSubmit={prepare}
      onChange={() => setPrepared(false)}
    >
      <div className="b-form-grid">
        <label htmlFor="name">
          Name
          <input
            id="name"
            name="Name"
            autoComplete="name"
            required
            maxLength={120}
          />
        </label>
        <label htmlFor="email">
          Email
          <input
            id="email"
            name="Email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
      </div>
      <label htmlFor="organization">
        Organization <span className="b-screen-reader-only">(optional)</span>
        <input
          id="organization"
          name="Organization"
          autoComplete="organization"
          maxLength={160}
        />
      </label>
      <div className="b-form-grid">
        <label htmlFor="city">
          City
          <input
            id="city"
            name="City"
            autoComplete="address-level2"
            required
            maxLength={160}
          />
        </label>
        <label htmlFor="interest">
          I’m interested in
          <select
            id="interest"
            name="Interest"
            defaultValue={waitlist ? "Product updates" : "A deployment call"}
          >
            <option>A deployment call</option>
            <option>Product updates</option>
            <option>Driver map updates</option>
          </select>
        </label>
      </div>
      {!waitlist ? (
        <label htmlFor="message">
          Your parking sites and questions
          <textarea id="message" name="Message" maxLength={4000} />
        </label>
      ) : null}
      <p className="b-form-note">
        This opens an email draft to {site.email}. Send it from your email app
        to request {waitlist ? "waitlist updates" : "a call"}. Your request is
        not saved on this website.{" "}
        <a href="/privacy" className="b-form-link">
          Privacy policy ↗
        </a>
      </p>
      <button type="submit" className="b-btn b-btn-primary">
        {waitlist ? "Request waitlist updates" : "Request a deployment call"}
        <span className="b-arrow" aria-hidden="true">
          ↗
        </span>
      </button>
      {prepared ? (
        <div role="status" className="b-form-status">
          Your email draft was requested. Check your email app and send it to
          finish. Your entries are kept here. If no draft opened, email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </div>
      ) : null}
    </form>
  );
}
