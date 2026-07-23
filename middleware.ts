import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LABORATORY_PATH_PREFIX = "/laboratory";
const LABORATORY_LOGIN_PATH = "/laboratory/login";

function isLaboratoryRoute(pathname: string) {
  return pathname === LABORATORY_PATH_PREFIX || pathname.startsWith(`${LABORATORY_PATH_PREFIX}/`);
}

function isLaboratoryLoginRoute(pathname: string) {
  return pathname === LABORATORY_LOGIN_PATH;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isLaboratoryRoute(pathname)) {
    return NextResponse.next();
  }

  if (isLaboratoryLoginRoute(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("ngemsLaboratorySession")?.value;
  if (!sessionCookie) {
    const redirectUrl = new URL(LABORATORY_LOGIN_PATH, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const parsed = JSON.parse(sessionCookie);
    if (!parsed?.authenticated || parsed?.role?.toLowerCase().includes("laboratory") || parsed?.role?.toLowerCase().includes("lab")) {
      return NextResponse.next();
    }
    const redirectUrl = new URL(LABORATORY_LOGIN_PATH, request.url);
    return NextResponse.redirect(redirectUrl);
  } catch {
    const redirectUrl = new URL(LABORATORY_LOGIN_PATH, request.url);
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ["/laboratory/:path*"],
};
