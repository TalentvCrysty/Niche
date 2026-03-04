'use client';

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

interface PageWrapperProps {
  children: React.ReactNode;
  heroConfig?: any;
  navbarConfig?: any;
  partnersConfig?: any;
  caseStudiesConfig?: any;
}

export function PageWrapper({
  children,
}: PageWrapperProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("ref");
    if (!code) return;
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("referral_code", code);
        const path = window.location.pathname + window.location.search;
        fetch(`${BACKEND_URL}/api/referrals/track-click`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, path }),
        }).catch(() => {});
        return;
      }
    } catch {
    }
  }, [searchParams]);

  return (
    <>
      {children}
    </>
  );
}
