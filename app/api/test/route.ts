/* 
    This was the migration script we used to migrate from
    our old database to the new Vercel Postgres database.
    It's not needed anymore, but I'm keeping it here for
    posterity.
*/

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
