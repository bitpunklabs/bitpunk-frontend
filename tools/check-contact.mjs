import assert from "node:assert/strict";
import { encodeEmail, decodeEmail, emailHref } from "../src/lib/contact.ts";

// Fictitious address only. Obfuscation reduces simple harvesting; it is reversible.
const address = "reader+notes@example.test";
const encoded = encodeEmail(address);
assert.ok(encoded && !encoded.includes(address) && !encoded.includes("@"));
assert.equal(decodeEmail(encoded), address);
assert.equal(emailHref(address), "mailto:reader%2Bnotes@example.test");
for (const value of [undefined, "", "reader@example.test?bcc=other@example.test", "reader@example.test\r\nBcc:other@example.test"]) {
  assert.equal(encodeEmail(value), null);
}
for (const value of ["", "not-hex", "5d0", "5d00"]) assert.equal(decodeEmail(value), null);
console.log("PASS: email obfuscation, mailto encoding and invalid configuration handling.");
