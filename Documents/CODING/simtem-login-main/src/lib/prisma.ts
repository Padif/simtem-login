import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getConnectionString() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL belum di-set. Salin .env.example ke .env lalu isi koneksi PostgreSQL. Lihat README.md.",
    );
  }
  return url;
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: getConnectionString(),
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 300_000,
    max: 10,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const value = client[prop as keyof PrismaClient];
    return typeof value === "function"
      ? (value as (...args: never[]) => unknown).bind(client)
      : value;
  },
});
