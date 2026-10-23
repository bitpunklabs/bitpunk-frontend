const mailbox = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i;

/** Reversible source obfuscation, not encryption or a human-verification boundary. */
export function encodeEmail(value?: string): string | null {
  const email = value?.trim();
  if (!email || !mailbox.test(email)) return null;
  const mask = 0x5d;
  return [mask, ...Array.from(email, char => char.charCodeAt(0) ^ mask)]
    .map(byte => byte.toString(16).padStart(2, "0")).join("");
}

export function decodeEmail(encoded: string): string | null {
  if (!/^(?:[a-f0-9]{2}){2,320}$/i.test(encoded)) return null;
  const mask = parseInt(encoded.slice(0, 2), 16);
  const email = encoded.slice(2).match(/../g)!
    .map(byte => String.fromCharCode(parseInt(byte, 16) ^ mask)).join("");
  return mailbox.test(email) ? email : null;
}

export function emailHref(email: string): string {
  const [name, domain] = email.split("@");
  return `mailto:${encodeURIComponent(name)}@${domain}`;
}
