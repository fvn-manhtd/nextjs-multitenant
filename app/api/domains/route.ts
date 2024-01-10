import prisma from "@/lib/database";
import { NextRequest } from "next/server";
import { ApiResponse } from "@/services/apiResponse";
import { isAuthenticated } from "@/services/auth";

/**
 * Handles the GET request for retrieving a list of admins.
 *
 * @param req - The NextRequest object representing the incoming request.
 * @returns A NextResponse object containing the list of admins in the response body.
 */
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated(req))) {
    return ApiResponse.unAuthenticated();
  }

  const body = await new Response(req.body).text();
  const { domain } = JSON.parse(body);

  try {
    const domainRes = await prisma.domains.findUnique({
      where: {
        domain: domain,
      },
    });
    return ApiResponse.success(domainRes);
  } catch (err) {
    return ApiResponse.error("Domain not found");
  }
}
