// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "./lib/contants";

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const reqURL = new URL(req.url);

  const host = req.headers.get("host");

  const token = req.cookies.get(COOKIE_NAME)?.value;

  console.log("token", token);

  const isIndexPage = reqURL.pathname === "/console";

  if (isIndexPage) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login`, req.url));
    }

    // return NextResponse.redirect(new URL(`/console`, req.url));
  }

  if (host === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return NextResponse.rewrite(new URL(`${url.pathname}`, req.url));
  }

  return NextResponse.rewrite(new URL(`/${host}${url.pathname}`, req.url));
}
