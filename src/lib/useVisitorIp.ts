"use client";

import { useEffect, useState } from "react";

/** Public echo service: no key, CORS-enabled, returns {"ip":"..."}. */
const ENDPOINT = "https://api.ipify.org?format=json";
const TIMEOUT_MS = 4000;

/** Only ever render something that looks like an address. */
const ADDRESS = /^[0-9a-fA-F.:]{3,45}$/;

/**
 * The visitor's own public address, shown back to them as a console detail.
 * Resolves to null when the request is blocked, offline, or slow — the status
 * bar simply omits the readout rather than showing an error.
 */
export function useVisitorIp(): string | null {
  const [ip, setIp] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    fetch(ENDPOINT, { signal: controller.signal, cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        const value =
          data && typeof data === "object" && "ip" in data
            ? String((data as { ip: unknown }).ip)
            : "";
        if (ADDRESS.test(value)) setIp(value);
      })
      .catch(() => {
        // Blocked, offline, or aborted: the detail is optional by design.
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return ip;
}
