import prisma from "@/lib/database";
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_KEY } from "@/lib/contants";

export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.headers.get("authorization");
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
      const admin = await prisma.admins.findFirst({
        where: {
          email: decoded.email,
          tenantId: decoded.tenant_id,
        },
      });
      return admin ? true : false;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        console.log("Token is expired");
      } else {
        console.log("Token is invalid");
      }
      return false;
    }
  }
  return false;
}
