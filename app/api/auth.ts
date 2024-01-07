import prisma from "@/lib/database";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "";

export async function isAuthenticated(req: NextRequest) {
  const token = req.headers.get("authorization");
  if (token) {
    try {
      jwt.verify(token, SECRET_KEY);
    } catch (err) {
      return false;
    }
    const user = await prisma.adminTokens.findFirst({
      where: {
        token: token,
      },
    });
    return user;
  }
  return false;
}
