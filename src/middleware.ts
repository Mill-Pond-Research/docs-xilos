import { NextRequest, NextResponse } from "next/server";

const LOGIN_URL = "https://www.xilos.ai/login?redirect=docs";
const VERIFY_URL = "https://api.xilos.ai/api/v1/auth/token/verify/";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Serve the local login page at /login (rewrite to the static HTML file)
  if (pathname === "/login" || pathname === "/login.html") {
    return NextResponse.rewrite(new URL("/login.html", req.url));
  }

  const token = req.cookies.get("xilos_docs_token")?.value;

  // No token cookie — redirect to login
  if (!token) {
    return NextResponse.redirect(LOGIN_URL);
  }

  // Validate the token against the API
  try {
    const res = await fetch(`${VERIFY_URL}${token}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      return NextResponse.next();
    }
  } catch {
    // API unreachable — allow through (fail open for availability)
    // The token cookie existing is enough signal that the user logged in
    return NextResponse.next();
  }

  // Token invalid or expired — redirect to login
  const response = NextResponse.redirect(LOGIN_URL);
  response.cookies.delete("xilos_docs_token");
  return response;
}

export const config = {
  matcher: [
    // Match all paths except:
    // - _next/static, _next/image (Next.js internals)
    // - favicon, logos, CSS, OG image (public assets)
    // - /api/* (auth, logout, tracking endpoints)
    "/((?!_next/static|_next/image|favicon\\.svg|favicon\\.ico|xilos-logo-.*\\.svg|xilos\\.css|og-image|api).*)",
  ],
};
