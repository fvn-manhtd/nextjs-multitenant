import prisma from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../auth";
import crypto from "crypto";
import { Validation } from "../validation";
import { ApiResponse } from "../apiResponse";

const SECRET_KEY = process.env.SECRET_KEY || "";

/**
 * Handles the GET request for retrieving a list of admins.
 *
 * @param req - The NextRequest object representing the incoming request.
 * @returns A NextResponse object containing the list of admins in the response body.
 */
export async function GET(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json(new ApiResponse("unauthenticated").toJson());
  }

  const admins = await prisma.admins.findMany();

  return NextResponse.json(new ApiResponse("ok", null, admins).toJson());
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
  const errors = [];
  if (!Validation.validateEmail(email)) {
    errors.push({ email: "Invalid email" });
  }
  if (!Validation.validateName(name)) {
    errors.push({ name: "Invalid name" });
  }
  if (!Validation.validateTenantId(tenantId)) {
    errors.push({ tenantId: "Invalid tenantId" });
  }
  if (!Validation.validatePassword(password)) {
    errors.push({ password: "Invalid password" });
  }

  if (errors.length > 0) {
    return NextResponse.json(new ApiResponse("error", errors).toJson());
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = Validation.hashPassword(password, salt);

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
  const newAdmin = await prisma.admins.create({
    data: {
      name: name,
      email: email,
      tenantId: tenantId,
      password: hashedPassword,
      status: false,
    },
  });

  const token = jwt.sign({ tenantId, name, email }, SECRET_KEY, {
    expiresIn: "1h",
  });

  /**
   * Creates a new admin token in the database.
   *
   * @param {string} adminId - The name of the admin.
   * @param {string} token - The email of the admin.
   * @returns {Promise<AdminToken>} - The newly created admin object.
   */
  await prisma.adminTokens.create({
    data: {
      adminId: newAdmin.id,
      token: token,
    },
  });

  return NextResponse.json(
    new ApiResponse("ok", { admin: newAdmin, token: token }).toJson()
  );
}
