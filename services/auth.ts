import prisma from "@/lib/database";
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { COOKIE_NAME, SECRET_KEY } from "@/lib/contants";
import { Domains } from "@prisma/client";

/**
 * Checks if the request is authenticated based on the provided token.
 * @param req - The NextRequest object representing the incoming request.
 * @returns A promise that resolves to a boolean indicating whether the request is authenticated.
 */
export async function isAuthenticated(req: NextRequest): Promise<boolean> {
  // const token = req.headers.get("authorization");
  const token = req.cookies.get(COOKIE_NAME)?.value;
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

/**
 * Checks if the host exists in the database.
 * @param req - The NextRequest object.
 * @returns A Promise that resolves to the Domains object if the host exists, or null if it doesn't.
 */
export async function isHostExist(req: NextRequest): Promise<Domains | null> {
  const host = req.headers.get("host");
  console.log("host", host);

  if (host) {
    const domain = await prisma.domains.findFirst({
      where: {
        domain: host,
      },
    });

    return domain;
  }

  return null;
}
