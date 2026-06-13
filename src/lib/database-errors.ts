export function isDatabaseUnavailableError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const code =
    typeof error === "object" && error !== null && "code" in error ? String((error as { code?: unknown }).code) : "";

  return (
    code === "ECONNREFUSED" ||
    message.includes("ECONNREFUSED") ||
    message.includes("Can't reach database server") ||
    message.includes("P1001")
  );
}
