import { NextResponse } from "next/server";
import { appendJsonlDevOnly } from "@/lib/storage";
import { isEmail, requiredString } from "@/lib/validators";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const RECIPIENTS = ["josh@curbiqsystems.com", "ryker@curbiqsystems.com"];

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = requiredString(form.get("name"), 120);
    const email = requiredString(form.get("email"), 200);
    const topic = requiredString(form.get("topic"), 80);
    const message = requiredString(form.get("message"), 2000);

    if (!name || !email || !topic || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }

    const payload = {
      kind: "contact",
      name,
      email,
      topic,
      message,
      ua: req.headers.get("user-agent"),
      ref: req.headers.get("referer")
    };

    console.log("[CONTACT_SUBMISSION]", payload);
    await appendJsonlDevOnly("contact.jsonl", payload);

    // ---- email both founders ----
    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY (contact)");
    } else {
      const from = "CurbIQ <onboarding@resend.dev>"; // swap to your verified sender later
      const subject = `[Site Contact] ${topic}`;
      const text = `New contact submission

Name: ${name}
Email: ${email}
Topic: ${topic}

Message:
${message}

UA: ${payload.ua || ""}
Ref: ${payload.ref || ""}
`;

      const result = await resend.emails.send({
        from,
        to: RECIPIENTS,
        replyTo: email,
        subject,
        text
      });

      console.log("[CONTACT_EMAIL_RESULT]", result);
      // @ts-ignore
      if (result?.error) console.error("[CONTACT_EMAIL_ERROR]", (result as any).error);
    }

    // For your new client-side form, return JSON.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("CONTACT route error:", err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
