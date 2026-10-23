import "server-only";
import { encodeEmail } from "@/lib/contact";
import { EmailLink } from "./email-link";

export function ContactLink({ label = "Contact", icon = false, showAddress = false }: {
  label?: string; icon?: boolean; showAddress?: boolean;
}) {
  const encoded = encodeEmail(process.env.CONTACT_EMAIL);
  if (!encoded) return null;
  return <EmailLink encoded={encoded} label={label} icon={icon} showAddress={showAddress} />;
}
