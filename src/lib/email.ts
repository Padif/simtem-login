import { Resend } from "resend";
import { createLogger } from "@/lib/logger";

const log = createLogger("email");

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

export async function sendPasswordResetCode(params: {
  to: string;
  code: string;
  name?: string | null;
}) {
  const appName = process.env.APP_NAME ?? "Cipher";
  const from = process.env.EMAIL_FROM ?? `${appName} <onboarding@resend.dev>`;
  const resend = getResend();

  const subject = `${params.code} is your ${appName} reset code`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; color: #0f172a;">
      <h1 style="font-size: 22px; margin: 0 0 12px;">Reset your password</h1>
      <p style="margin: 0 0 20px; color: #475569; line-height: 1.6;">
        Hi${params.name ? ` ${params.name}` : ""}, use this verification code to reset your ${appName} password. It expires in 15 minutes.
      </p>
      <div style="letter-spacing: 8px; font-size: 32px; font-weight: 700; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center;">
        ${params.code}
      </div>
      <p style="margin: 20px 0 0; color: #64748b; font-size: 13px; line-height: 1.5;">
        If you did not request this, you can safely ignore this email.
      </p>
    </div>
  `;

  if (!resend) {
    log.warn(
      { to: params.to, code: params.code },
      "RESEND_API_KEY missing — logging reset code for development",
    );
    return { id: "dev-fallback", mocked: true as const };
  }

  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject,
    html,
  });

  if (error) {
    log.error({ err: error, to: params.to }, "Failed to send reset email");
    throw new Error(error.message);
  }

  log.info({ to: params.to, emailId: data?.id }, "Reset email sent");
  return { id: data?.id, mocked: false as const };
}
