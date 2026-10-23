"use client";

import { useSyncExternalStore } from "react";
import { decodeEmail, emailHref } from "@/lib/contact";
import { actionStyles } from "./action-label";
import styles from "./email-link.module.css";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function EmailLink({ encoded, label, icon, showAddress }: {
  encoded: string; label: string; icon: boolean; showAddress: boolean;
}) {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  const email = ready ? decodeEmail(encoded) : null;
  const content = <>
    {icon && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg>}
    <span>{showAddress && email ? email : label}</span>
  </>;

  return email
    ? <a className={`${styles.link} ${actionStyles.interactive}`} href={emailHref(email)} aria-label={`Email Bitpunk: ${email}`} title={email}>{content}</a>
    : <span className={styles.placeholder} aria-hidden="true">{content}</span>;
}
