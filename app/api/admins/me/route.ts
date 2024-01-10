import prisma from "@/lib/database";
import { NextRequest } from "next/server";
import { ApiResponse } from "@/services/apiResponse";
import { isAuthenticated } from "@/services/auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_KEY } from "@/lib/contants";

/**
 * Handles the GET request for retrieving a list of admins.
 *
 * @param req - The NextRequest object representing the incoming request.
 * @returns A NextResponse object containing the list of admins in the response body.
 */
export async function GET(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return ApiResponse.unAuthenticated();
  }

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
      const adminWithoutPassword = { ...admin, password: undefined };
      return ApiResponse.success(adminWithoutPassword);
    } catch (err) {
      return ApiResponse.error("No admin found");
    }
  }
  // Add a return statement here to handle the case where there is no token
  return ApiResponse.error("No authorization token provided");
}
