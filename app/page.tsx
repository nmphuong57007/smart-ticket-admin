"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

import { redirectConfig } from "@/helpers/redirect-config";

export default function HomePage() {
  const pathname = usePathname();
  const router = useRouter();

  useLayoutEffect(() => {
    if (pathname === "/") {
      router.replace(redirectConfig.home);
    }
  }, [pathname, router]);

  return <></>;
}
