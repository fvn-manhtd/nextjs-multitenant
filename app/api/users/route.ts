import prisma from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany();

  return NextResponse.json({ response: "ok", data: users });
}

export async function POST(req: NextRequest) {
  const body = await new Response(req.body).text();
  const { name, email } = JSON.parse(body);

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
    },
  });

  return NextResponse.json({ response: "ok", data: newUser });
}
