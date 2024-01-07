import prisma from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../auth";
import { Validation } from "../validation";
import { ApiResponse } from "../apiResponse";
import { ulid } from "ulid";

const SECRET_KEY = process.env.SECRET_KEY || "";

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

  const admins = await prisma.admins.findMany();

  return ApiResponse.success(admins);
}

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

  /**
   * Creates a new admin in the database.
   *
   * @param {string} name - The name of the admin.
   * @param {string} email - The email of the admin.
   * @param {string} tenantId - The ID of the tenant the admin belongs to.
   * @param {string} hashedPassword - The hashed password of the admin.
   * @param {string} status - The status of the admin. default is false, need to active by email
   * @returns {Promise<Admin>} - The newly created admin object.
   */
  try {
    const newAdmin = await prisma.admins.create({
      data: {
        id: ulid(),
        name,
        email,
        tenantId: tenantId,
        password: hashedPassword,
        status: false,
      },
    });
    const token = jwt.sign({ tenantId, name, email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    await prisma.adminTokens.create({
      data: { id: ulid(), adminId: newAdmin.id, token },
    });

    const temporayDomain = `${tenantId}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
    await prisma.domains.create({
      data: { id: ulid(), domain: temporayDomain, tenantId: tenantId },
    });

    return ApiResponse.success({ admin: newAdmin, token: token });
  } catch (error) {
    console.error("Error creating admin:", error);
    return ApiResponse.error("Error creating new tenant");
  }
}
