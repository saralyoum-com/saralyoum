"use client";

import { useEffect } from "react";

// Next.js 14's client router sends the current pathname as the "Next-Url"
// request header on every RSC navigation fetch. Since this site's canonical
// URLs are Arabic, that header value contains non-Latin1 characters, which
// the browser's fetch() rejects outright ("String contains non ISO-8859-1
// code point") — Next.js catches the failure and silently falls back to a
// full page reload on EVERY internal navigation. Not fixed as of Next
// 14.2.35 (latest stable 14.x patch — confirmed via node_modules source,
// see fetch-server-response.js). Percent-encoding just this one header on
// Next's own RSC fetches (identified by the sibling RSC header) avoids the
// crash so client-side transitions actually work. Nothing server-side on
// this site reads Next-Url (no parallel/intercepting routes in app/), so the
// encoded value has no behavioral effect beyond fixing the crash.
function hasNonLatin1(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) return true;
  }
  return false;
}

export default function RscHeaderFix() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as typeof window & { __rscHeaderFixApplied?: boolean };
    if (w.__rscHeaderFixApplied) return;
    w.__rscHeaderFixApplied = true;

    const originalFetch = window.fetch.bind(window);
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = init?.headers;
      if (headers && typeof headers === "object" && !(headers instanceof Headers) && !Array.isArray(headers)) {
        const h = headers as Record<string, string>;
        const nextUrl = h["Next-Url"];
        if (h["RSC"] && typeof nextUrl === "string" && hasNonLatin1(nextUrl)) {
          init = { ...init, headers: { ...h, "Next-Url": encodeURIComponent(nextUrl) } };
        }
      }
      return originalFetch(input, init);
    };
  }, []);

  return null;
}
