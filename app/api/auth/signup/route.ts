import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createAuthCookies } from "@/lib/auth";
import { signupSchema } from "@/lib/validators";
import { successResponse, handleApiError, ApiError } from "@/lib/api";
import { UserRole, VerificationStatus } from "@/lib/generated/prisma/enums";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(parsed.error.issues[0]?.message ?? "Invalid signup data", 400);
    }

    const { email, password, firstName, lastName, role, companyName } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ApiError("An account with this email already exists", 409);
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: { email, firstName, lastName, role, passwordHash },
      });

      if (role === UserRole.CANDIDATE) {
        await tx.candidate.create({ data: { userId: createdUser.id } });
      } else {
        // role === RECRUITER; signupSchema guarantees companyName is set.
        if (!companyName) {
          throw new ApiError("Company name is required for recruiter accounts", 400);
        }

        const company = await tx.company.upsert({
          where: { name: companyName },
          create: { name: companyName, verificationStatus: VerificationStatus.PENDING },
          update: {},
        });

        await tx.recruiter.create({
          data: { userId: createdUser.id, companyId: company.id },
        });
      }

      return createdUser;
    });

    await createAuthCookies({ id: user.id, email: user.email, role: user.role });

    // Signup should still succeed even if the mail provider is down.
    try {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?userId=${user.id}`;
      await sendVerificationEmail(user.email, verificationUrl);
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }

    return successResponse(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}
