"use client";

import { useProfile } from "@/api/hooks/use-profile";
import { Spinner } from "@/components/ui/spinner";
import { redirectConfig } from "@/helpers/redirect-config";
import { hasToken } from "@/helpers/has-token";
import { redirect } from "next/navigation";
import { useEffect } from "react";

interface ProtectedLayoutProps {
  readonly children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { data, isSuccess, isError } = useProfile();

  useEffect(() => {
    if (!hasToken() || isError) {
      redirect(redirectConfig.login);
      return;
    }
  }, [isError]);

  if (isSuccess && data) {
    return <>{children}</>;
  }

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
}
