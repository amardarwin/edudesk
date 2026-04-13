import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Need a text encoder to provide the secret, matching lib/auth.ts
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error("The environment variable JWT_SECRET is not set.");
  }
  return new TextEncoder().encode(secret);
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAdminApi = pathname.startsWith("/api/admin");

  let payload: any = null;

  if (token) {
    try {
      const verified = await jwtVerify(token, getJwtSecretKey());
      payload = verified.payload;
    } catch (err) {
      payload = null;
    }
  }

  // Redirect authenticated users away from login/register pages
  if (isAuthPage && payload) {
    return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, req.url));
  }

  // Protect Admin APIs
  if (isAdminApi) {
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Protect dashboard routes
  if (isDashboardPage) {
    if (!payload) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access control
    const isAdminRoute = pathname.startsWith("/dashboard/admin");
    const isStudentRoute = pathname.startsWith("/dashboard/student");

    if (isAdminRoute && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/student", req.url));
    }

    if (isStudentRoute && payload.role !== "student") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
    
    // Redirect /dashboard to appropriate dashboard
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/api/admin/:path*"],
};
