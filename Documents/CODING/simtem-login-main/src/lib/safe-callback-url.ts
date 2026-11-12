const DEFAULT_CALLBACK = "/dashboard";

export function safeCallbackUrl(value: string | null | undefined): string {
  if (!value) {
    return DEFAULT_CALLBACK;
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return DEFAULT_CALLBACK;
  }

  return value;
}
