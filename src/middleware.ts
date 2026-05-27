import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function cleanupStaleEntries() {
  const now = Date.now();
  for (const [ip, entry] of ipRequestMap) {
    if (now > entry.resetAt) {
      ipRequestMap.delete(ip);
    }
  }
}

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (req.nextUrl.pathname === "/api/health") {
    return NextResponse.next();
  }

  const ip = getClientIp(req);
  const now = Date.now();

  if (ipRequestMap.size > 10_000) {
    cleanupStaleEntries();
  }

  const entry = ipRequestMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRequestMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return NextResponse.next();
  }

  const newCount = entry.count + 1;
  ipRequestMap.set(ip, { count: newCount, resetAt: entry.resetAt });

  if (newCount > MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((entry.resetAt - now) / 1000)
          ),
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
