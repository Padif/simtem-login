import bcrypt from "bcryptjs";
import { createHash, randomInt } from "crypto";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateResetCode(): string {
  return randomInt(100000, 999999).toString();
}

export function hashResetCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}
