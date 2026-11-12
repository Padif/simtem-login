import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Reset password · Cipher",
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<div className="h-80 animate-pulse rounded-2xl bg-slate-100" />}
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
