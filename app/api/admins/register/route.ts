import prisma from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ulid } from "ulid";
import { emailService } from "@/services/emailService";
import { ApiResponse } from "@/services/apiResponse";
import { Validation } from "@/services/validation";
import { SECRET_KEY } from "@/lib/contants";

/**
 * Handles the POST request to create a new admin.
 *
 * @param {NextRequest} req - The NextRequest object representing the incoming request.
 * @returns {Promise<NextResponse>} - The NextResponse object representing the response.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await new Response(req.body).text();
  const { name, email, tenantId, password } = JSON.parse(body);

  // Validate input
  const errors = Validation.validateAll(name, email, tenantId, password);

  if (errors.length > 0) {
    return ApiResponse.error(errors);
  }

  const hashedPassword = Validation.hashPassword(password);

  try {
    // Check for existing email and tenantId
    const existingEmail = await prisma.admins.findUnique({ where: { email } });
    const existingTenantId = await prisma.admins.findUnique({
      where: { tenantId },
    });
    if (existingEmail) {
      return ApiResponse.error("Email already exists");
    }
    if (existingTenantId) {
      return ApiResponse.error("Subdomain already exists");
    }

    // Create a new admin
    let newAdmin;
    try {
      newAdmin = await prisma.admins.create({
        data: {
          id: ulid(),
          name,
          email,
          tenantId: tenantId,
          password: hashedPassword,
          status: false,
        },
      });
    } catch (error) {
      return ApiResponse.error("Error creating admin token");
    }

    // Create a temporary domain
    try {
      const temporayDomain = `${tenantId}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
      await prisma.domains.create({
        data: { id: ulid(), domain: temporayDomain, tenantId: tenantId },
      });
    } catch (error) {
      return ApiResponse.error("Error creating domain");
    }

    // Send verification email
    try {
      // Create a new token
      const token = jwt.sign({ tenantId, name, email }, SECRET_KEY, {
        expiresIn: "1h",
      });
      await emailService.sendVerificationEmail(email, token);
    } catch (error) {
      return ApiResponse.error("Error sending email");
    }

    return ApiResponse.success({ admin: newAdmin });
  } catch (error) {
    console.error("Error creating admin:", error);
    return ApiResponse.error("Error creating new tenant");
  }
}
