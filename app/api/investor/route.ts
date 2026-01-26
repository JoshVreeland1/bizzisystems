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
    const organization = requiredString(form.get("organization"), 200);
    const message = requiredString(form.get("message"), 2000);
    const accredited = form.get("accredited") === "on";

    if (!name || !email || !organization || !message) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }

    const payload = {
      kind: "investor",
      name,
      email,
      organization,
      message,
      accredited,
      ua: req.headers.get("user-agent"),
      ref: req.headers.get("referer")
    };

    console.log("[INVESTOR_SUBMISSION]", payload);
    await appendJsonlDevOnly("investors.jsonl", payload);

    // ---- email both founders ----
    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY (investors)");
    } else {
      const from = "CurbIQ <onboarding@resend.dev>"; // swap to your verified sender later
      const subject = `[Investor Inquiry] ${organization}${accredited ? " (Accredited)" : ""}`;
      const text = `New investor submission

Name: ${name}
Email: ${email}
Organization: ${organization}
Accredited: ${accredited ? "Yes" : "No"}

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

      console.log("[INVESTOR_EMAIL_RESULT]", result);
      // @ts-ignore
      if (result?.error) console.error("[INVESTOR_EMAIL_ERROR]", (result as any).error);
    }

    // Support fetch-based forms AND classic form submits
    const wantsJson =
      req.headers.get("accept")?.includes("application/json") ||
      req.headers.get("x-requested-with") === "fetch" ||
      req.headers.get("content-type")?.includes("multipart/form-data");

    if (wantsJson) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.redirect(new URL("/investors?submitted=1", req.url), 303);
  } catch (err) {
    console.error("INVESTORS route error:", err);
    return NextResponse.json({ ok: false, error: "Server error." }, { status: 500 });
  }
}
