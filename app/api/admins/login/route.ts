import prisma from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ulid } from "ulid";
import { ApiResponse } from "@/services/apiResponse";
import { Validation } from "@/services/validation";
import { COOKIE_NAME, SECRET_KEY } from "@/lib/contants";
import { cookies } from "next/headers";
import { isHostExist } from "@/services/auth";

/**
 * Handles the POST request to create a new admin.
 *
 * @param {NextRequest} req - The NextRequest object representing the incoming request.
 * @returns {Promise<NextResponse>} - The NextResponse object representing the response.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const hostExists = await isHostExist(req);
  if (!hostExists) {
    return ApiResponse.error("Domain does not exist", 404);
  }

  const body = await new Response(req.body).text();
  const { email, password } = JSON.parse(body);

  const admin = await prisma.admins.findFirst({
    where: {
      email: email,
    },
  });
  if (admin?.tenantId !== hostExists?.tenantId) {
    return ApiResponse.error(
      "Account does not exist. Please check email, password again",
      404
    );
  }

  // check if admin exists
  if (!admin || !admin.status || !admin.verifiedAt) {
    return ApiResponse.error(
      "Account does not exist. Please check email, password again",
      404
    );
  }
  const { password: passwordAdmin, ...adminWithoutPassword } = admin;
  const isPassword = Validation.compareHashedPassword(password, passwordAdmin);
  if (!isPassword) {
    return ApiResponse.error(
      "Account does not exist. Please check email, password again",
      404
    );
  }

  const token = jwt.sign({ tenantId: admin.tenantId, email }, SECRET_KEY, {
    expiresIn: "10s",
  });

  // Create a new admin token
  try {
    await prisma.adminTokens.create({
      data: { id: ulid(), adminId: admin.id, token },
    });
  } catch (error) {
    return ApiResponse.error("Error login", 400);
  }

  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: "/",
  });

  return ApiResponse.success({ admin: adminWithoutPassword, token: token });
}
