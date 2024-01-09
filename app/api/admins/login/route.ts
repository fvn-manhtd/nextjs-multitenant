import prisma from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ulid } from "ulid";
import { ApiResponse } from "@/services/apiResponse";
import { Validation } from "@/services/validation";
import { SALT, SECRET_KEY } from "@/lib/contants";
import { Admins } from "@prisma/client";

/**
 * Handles the POST request to create a new admin.
 *
 * @param {NextRequest} req - The NextRequest object representing the incoming request.
 * @returns {Promise<NextResponse>} - The NextResponse object representing the response.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await new Response(req.body).text();
  const { email, password } = JSON.parse(body);

  const admin = await prisma.admins.findFirst({
    where: {
      email: email,
    },
  });

  // check if admin exists
  if (!admin || !admin.status || !admin.verifiedAt) {
    return ApiResponse.error("Admin not found");
  }
  const { password: passwordAdmin, ...adminWithoutPassword } = admin;
  const isPassword = Validation.compareHashedPassword(password, passwordAdmin);
  if (!isPassword) {
    return ApiResponse.error("Password is wrong");
  }

  const token = jwt.sign({ tenantId: admin.tenantId, email }, SECRET_KEY, {
    expiresIn: "1h",
  });

  // Create a new admin token
  try {
    await prisma.adminTokens.create({
      data: { id: ulid(), adminId: admin.id, token },
    });
  } catch (error) {
    return ApiResponse.error("Error creating admin token");
  }

  return ApiResponse.success({ admin: adminWithoutPassword, token: token });
}
