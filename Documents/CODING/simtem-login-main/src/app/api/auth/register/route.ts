import { NextResponse } from "next/server";
import { createLogger } from "@/lib/logger";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";

const log = createLogger("api.register");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      log.warn({ email }, "Registration rejected — email already used");
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    log.info({ userId: user.id, email }, "User registered");
    return NextResponse.json(
      { message: "Account created successfully", user },
      { status: 201 },
    );
  } catch (error) {
    log.error({ err: error }, "Registration failed");
    return NextResponse.json(
      { error: "Unable to create account right now" },
      { status: 500 },
    );
  }
}
