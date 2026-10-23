"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Standalone launch pages share fonts and identity without loading site widgets. */
export function SiteFrame({ children, chrome, footer }: {
  children: ReactNode;
  chrome: ReactNode;
  footer: ReactNode;
}) {
  const standalone = usePathname() === "/coming-soon";
  if (standalone) return <main id="main-content">{children}</main>;
  return <div className="frame">
    <div className="site-chrome" data-site-chrome>{chrome}</div>
    <main id="main-content">{children}</main>
    {footer}
  </div>;
}
