import "server-only";

// Prosty cache w pamięci dla danych użytkownika
const cache = new Map<
  string,
  { data: unknown; timestamp: number; ttl: number }
>();

// TTL (Time To Live) w milisekundach
const CACHE_TTL = {
  INVOICES: 5 * 60 * 1000, // 5 minut
  CLIENTS: 10 * 60 * 1000, // 10 minut
  ANALYTICS: 15 * 60 * 1000, // 15 minut
} as const;

export function getCacheKey(
  prefix: string,
  userId: string,
  ...params: string[]
): string {
  return `${prefix}:${userId}:${params.join(":")}`;
}

export function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  // Sprawdź czy cache nie wygasł
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCache<T>(key: string, data: T, ttl: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

export function invalidateCache(pattern: string): void {
  const keysToDelete: string[] = [];

  for (const key of Array.from(cache.keys())) {
    if (key.includes(pattern)) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach((key) => cache.delete(key));
}

export function clearAllCache(): void {
  cache.clear();
}

// Funkcje pomocnicze dla konkretnych typów danych
export function getCachedInvoices(
  userId: string,
  search: string,
  offset: number
) {
  const key = getCacheKey("invoices", userId, search, offset.toString());
  return getFromCache(key);
}

export function setCachedInvoices(
  userId: string,
  search: string,
  offset: number,
  data: unknown
) {
  const key = getCacheKey("invoices", userId, search, offset.toString());
  setCache(key, data, CACHE_TTL.INVOICES);
}

export function getCachedClients(
  userId: string,
  search: string | null,
  offset: number | null,
  getAll: boolean
) {
  const key = getCacheKey(
    "clients",
    userId,
    search || "null",
    offset?.toString() || "null",
    getAll.toString()
  );
  return getFromCache(key);
}

export function setCachedClients(
  userId: string,
  search: string | null,
  offset: number | null,
  getAll: boolean,
  data: unknown
) {
  const key = getCacheKey(
    "clients",
    userId,
    search || "null",
    offset?.toString() || "null",
    getAll.toString()
  );
  setCache(key, data, CACHE_TTL.CLIENTS);
}

export function getCachedAnalytics(userId: string) {
  const key = getCacheKey("analytics", userId);
  return getFromCache(key);
}

export function setCachedAnalytics(userId: string, data: unknown) {
  const key = getCacheKey("analytics", userId);
  setCache(key, data, CACHE_TTL.ANALYTICS);
}

// Funkcja do czyszczenia cache po modyfikacji danych
export function invalidateUserCache(userId: string): void {
  invalidateCache(userId);
}
