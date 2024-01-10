import prisma from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ulid } from "ulid";
import { ApiResponse } from "@/services/apiResponse";
import { Validation } from "@/services/validation";
import { COOKIE_NAME, SECRET_KEY } from "@/lib/contants";
import { cookies } from "next/headers";
import { isAuthenticated, isHostExist } from "@/services/auth";

/**
 * Handles the POST request to create a new admin.
 *
 * @param {NextRequest} req - The NextRequest object representing the incoming request.
 * @returns {Promise<NextResponse>} - The NextResponse object representing the response.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!(await isAuthenticated(req))) {
    return ApiResponse.unAuthenticated();
  }

  const hostExists = await isHostExist(req);
  if (!hostExists) {
    return ApiResponse.error("Domain does not exist", 404);
  }

  cookies().delete(COOKIE_NAME);

  return ApiResponse.success("Logged out successfully");
}
