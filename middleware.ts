// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host");

  if (host === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return NextResponse.rewrite(new URL(`${url.pathname}`, req.url));
  }

  return NextResponse.rewrite(new URL(`/${host}${url.pathname}`, req.url));
}
