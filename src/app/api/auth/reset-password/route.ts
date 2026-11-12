import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import { hashPassword, hashResetCode } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations";

const log = createLogger("api.reset-password");
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, code, password } = parsed.data;
    const token = await prisma.passwordResetToken.findFirst({
      where: {
        email,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!token) {
      log.warn({ email }, "Reset failed — no valid token");
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    if (token.attempts >= MAX_ATTEMPTS) {
      await prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { used: true },
      });
      return NextResponse.json(
        { error: "Too many attempts. Request a new code." },
        { status: 429 },
      );
    }

    const matches = token.codeHash === hashResetCode(code);
    if (!matches) {
      await prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } },
      });
      log.warn({ email }, "Reset failed — bad verification code");
      return NextResponse.json(
        { error: "Invalid or expired verification code" },
        { status: 400 },
      );
    }

    const hashed = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashed },
      }),
      prisma.passwordResetToken.update({
        where: { id: token.id },
        data: { used: true },
      }),
      prisma.passwordResetToken.updateMany({
        where: { email, used: false },
        data: { used: true },
      }),
    ]);

    log.info({ email }, "Password reset completed");
    return NextResponse.json({
      message: "Password updated successfully. You can sign in now.",
    });
  } catch (error) {
    log.error({ err: error }, "Reset password failed");
    return NextResponse.json(
      { error: "Unable to reset password right now" },
      { status: 500 },
    );
  }
}
