import prisma from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../auth";

const SECRET_KEY = process.env.SECRET_KEY || "";

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ status: "unauthenticated" });
  }

  const users = await prisma.user.findMany();

  return NextResponse.json({ status: "ok", data: users });
}

export async function POST(req: NextRequest) {
  const body = await new Response(req.body).text();
  const { name, email } = JSON.parse(body);

  const token = jwt.sign({ name, email }, SECRET_KEY, {
    expiresIn: "1h",
  });

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      token: token,
    },
  });

  return NextResponse.json({ status: "ok", data: newUser });
}
