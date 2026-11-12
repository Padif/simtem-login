import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cipher",
    template: "%s · Cipher",
  },
  description:
    "Professional Next.js authentication with credentials, OAuth, and password recovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
