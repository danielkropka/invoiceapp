import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Dodatkowe sprawdzenia bezpieczeństwa
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Sprawdź czy użytkownik ma ważną sesję
    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Dodaj nagłówki bezpieczeństwa
    const response = NextResponse.next();

    // Security headers
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    // CSP header
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://accounts.google.com; frame-src 'self' https://accounts.google.com;"
    );

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Debug logi dla produkcji
        if (process.env.NODE_ENV === "production") {
          console.log(`Middleware: ${pathname}, token: ${!!token}`);
        }

        // Publiczne ścieżki
        if (
          pathname.startsWith("/sign-in") ||
          pathname.startsWith("/sign-up") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/_next") ||
          pathname.startsWith("/favicon.ico") ||
          pathname.startsWith("/confirm-invoice") ||
          pathname === "/"
        ) {
          return true;
        }

        // Wymagaj autoryzacji dla wszystkich innych ścieżek
        const isAuthorized = !!token;

        if (!isAuthorized && process.env.NODE_ENV === "production") {
          console.log(`Unauthorized access to: ${pathname}`);
        }

        return isAuthorized;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
