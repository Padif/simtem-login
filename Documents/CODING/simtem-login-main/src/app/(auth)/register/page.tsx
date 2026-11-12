import { RegisterForm } from "@/components/auth/register-form";
import { getEnabledOAuthProviders } from "@/lib/oauth";

export const metadata = {
  title: "Create account · Cipher",
};

export default function RegisterPage() {
  const providers = getEnabledOAuthProviders();
  return <RegisterForm providers={providers} />;
}
