import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createAuthCookies } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { successResponse, handleApiError, ApiError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid login data", 400);
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new ApiError("Invalid email or password", 401);
    }

    await createAuthCookies({ id: user.id, email: user.email, role: user.role });

    return successResponse({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
