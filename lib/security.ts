import { headers } from "next/headers";

// Rate limiting storage (w produkcji użyj Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  identifier?: string;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = `${identifier}:${config.identifier || "default"}`;
  const stored = rateLimitStore.get(key);

  if (!stored || now > stored.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime,
    };
  }

  if (stored.count >= config.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: stored.resetTime,
    };
  }

  stored.count++;
  return {
    allowed: true,
    remaining: config.maxAttempts - stored.count,
    resetTime: stored.resetTime,
  };
}

export function getClientIP(): string {
  const headersList = headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Usuń potencjalne tagi HTML
    .substring(0, 1000); // Ogranicz długość
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function generateSecureToken(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function logSecurityEvent(
  event: string,
  details: Record<string, unknown>,
  severity: "low" | "medium" | "high" = "medium"
): void {
  const timestamp = new Date().toISOString();
  const ip = getClientIP();

  console.log(`[SECURITY-${severity.toUpperCase()}] ${timestamp} - ${event}`, {
    ip,
    ...details,
  });
}

// Cleanup old rate limit entries (call this periodically)
export function cleanupRateLimit(): void {
  const now = Date.now();
  rateLimitStore.forEach((value, key) => {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}

// Run cleanup every 5 minutes
if (typeof window === "undefined") {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}
