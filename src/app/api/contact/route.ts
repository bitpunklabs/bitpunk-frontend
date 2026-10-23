import { contactResponse } from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function handle(request: Request) {
  return contactResponse(request, {
    email: process.env.CONTACT_EMAIL?.trim(),
    siteKey: process.env.TURNSTILE_SITE_KEY?.trim(),
    secretKey: process.env.TURNSTILE_SECRET_KEY?.trim(),
    production: process.env.NODE_ENV === "production",
  });
}

export const GET = handle;
export const POST = handle;
