import { NextResponse } from "next/server";
import { appendJsonlDevOnly } from "@/lib/storage";
import { isEmail, requiredString } from "@/lib/validators";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ sends to both of you
const RECIPIENTS = ["josh@curbiqsystems.com", "ryker@curbiqsystems.com"];

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = requiredString(form.get("name"), 120);
    const email = requiredString(form.get("email"), 200);
    const city = requiredString(form.get("city"), 120);
    const audience = requiredString(form.get("audience"), 40);

    if (!name || !email || !city || !audience) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }
    if (audience !== "driver" && audience !== "city") {
      return NextResponse.json({ ok: false, error: "Invalid audience." }, { status: 400 });
    }

    const payload = {
      kind: "waitlist",
      name,
      email,
      city,
      audience,
      ua: req.headers.get("user-agent"),
      ref: req.headers.get("referer")
    };

    console.log("[WAITLIST_SUBMISSION]", payload);
    await appendJsonlDevOnly("waitlist.jsonl", payload);

    // ---- email both founders ----
    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY (waitlist)");
    } else {
      const from = "CurbIQ <onboarding@resend.dev>"; // swap to your verified sender later
      const subject = `[Bizzi Waitlist] ${audience.toUpperCase()} — ${city}`;
      const text = `New waitlist submission

Name: ${name}
Email: ${email}
City: ${city}
Audience: ${audience}

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

      console.log("[WAITLIST_EMAIL_RESULT]", result);
      // @ts-ignore
      if (result?.error) console.error("[WAITLIST_EMAIL_ERROR]", (result as any).error);
    }

    // Support fetch-based forms AND classic form submits
    const wantsJson =
      req.headers.get("accept")?.includes("application/json") ||
      req.headers.get("x-requested-with") === "fetch" ||
      req.headers.get("content-type")?.includes("multipart/form-data");

    if (wantsJson) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.redirect(new URL("/waitlist?submitted=1", req.url), 303);
  } catch (err) {
    console.error("WAITLIST route error:", err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
