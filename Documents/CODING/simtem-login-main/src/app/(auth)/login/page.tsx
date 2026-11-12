import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { getEnabledOAuthProviders } from "@/lib/oauth";

export const metadata = {
  title: "Sign in · Cipher",
};

export default function LoginPage() {
  const providers = getEnabledOAuthProviders();

  return (
    <Suspense
      fallback={<div className="h-80 animate-pulse rounded-2xl bg-slate-100" />}
    >
      <LoginForm providers={providers} />
    </Suspense>
  );
}
