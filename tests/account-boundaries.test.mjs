import assert from "node:assert/strict";
import test from "node:test";
import { getAuthRedirectUrl } from "../src/lib/auth-redirect.ts";
import { isActiveEntitlement } from "../src/lib/entitlements.ts";

test("OAuth return URL retains local paths, query strings and fragments", () => {
  assert.equal(
    getAuthRedirectUrl("/account/settings?tab=identity#providers", "https://bitpunk.io").href,
    "https://bitpunk.io/account/settings?tab=identity#providers",
  );
});

test("OAuth return URL rejects external, malformed and parser-normalised destinations", () => {
  for (const path of [null, "", "https://example.com", "//example.com", "/\\example.com", "/\t/example.com", "//[", "javascript:alert(1)"]) {
    assert.equal(getAuthRedirectUrl(path, "https://bitpunk.io").href, "https://bitpunk.io/account", String(path));
  }
});

test("OAuth origin check includes scheme and port", () => {
  assert.equal(getAuthRedirectUrl("//localhost:3108/account", "http://localhost:3107").href, "http://localhost:3107/account");
});

test("access expires at the exact boundary even while its stored status is active", () => {
  const now = Date.parse("2026-09-22T12:00:00Z");
  for (const expires_at of ["2026-09-22T11:59:59Z", "2026-09-22T12:00:00Z", "invalid"]) {
    assert.equal(isActiveEntitlement({ status: "active", expires_at }, now), false);
  }
  assert.equal(isActiveEntitlement({ status: "active", expires_at: "2026-09-22T12:00:01Z" }, now), true);
  assert.equal(isActiveEntitlement({ status: "active", expires_at: null }, now), true);
  assert.equal(isActiveEntitlement({ status: "revoked", expires_at: null }, now), false);
});
