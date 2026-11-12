import { NextResponse } from "next/server";
import { sendPasswordResetCode } from "@/lib/email";
import { createLogger } from "@/lib/logger";
import { generateResetCode, hashResetCode } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations";

const log = createLogger("api.forgot-password");
const CODE_TTL_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid email enumeration
    const successResponse = NextResponse.json({
      message:
        "If an account exists for that email, a verification code has been sent.",
    });

    if (!user?.password) {
      log.info({ email }, "Forgot password skipped — no local password user");
      return successResponse;
    }

    await prisma.passwordResetToken.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    const code = generateResetCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_MS);

    await prisma.passwordResetToken.create({
      data: {
        email,
        codeHash: hashResetCode(code),
        expiresAt,
        userId: user.id,
      },
    });

    await sendPasswordResetCode({
      to: email,
      code,
      name: user.name,
    });

    log.info({ email, userId: user.id }, "Password reset code issued");
    return successResponse;
  } catch (error) {
    log.error({ err: error }, "Forgot password failed");
    return NextResponse.json(
      { error: "Unable to process password reset right now" },
      { status: 500 },
    );
  }
}
