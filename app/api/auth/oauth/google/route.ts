import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { hashPassword, createAuthCookies } from "@/lib/auth";
import { successResponse, handleApiError, ApiError } from "@/lib/api";
import { UserRole } from "@/lib/generated/prisma/enums";

function getGoogleClient(): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID environment variable is not set");
  }

  return new OAuth2Client(clientId);
}

interface GoogleProfile {
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Verifies a Google ID token's signature against Google's public keys and
 * checks it was issued for this app (`aud`) with a verified email — using
 * google-auth-library rather than the rate-limited `tokeninfo` debug
 * endpoint, which Google does not recommend for production verification.
 */
async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  const client = getGoogleClient();

  let ticket;
  try {
    ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  } catch {
    throw new ApiError("Invalid Google ID token", 401);
  }

  const payload = ticket.getPayload();

  if (!payload?.email || !payload.email_verified) {
    throw new ApiError("Google account email is not verified", 401);
  }

  return {
    email: payload.email,
    firstName: payload.given_name ?? "Google",
    lastName: payload.family_name ?? "User",
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = typeof body?.idToken === "string" ? body.idToken : null;

    if (!idToken) {
      throw new ApiError("idToken is required", 400);
    }

    const googleProfile = await verifyGoogleIdToken(idToken);

    let user = await prisma.user.findUnique({ where: { email: googleProfile.email } });

    if (!user) {
      // OAuth-created accounts still need a passwordHash (schema requires
      // it); this random value just makes password login impossible.
      const passwordHash = await hashPassword(randomUUID());

      user = await prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            email: googleProfile.email,
            firstName: googleProfile.firstName,
            lastName: googleProfile.lastName,
            role: UserRole.CANDIDATE,
            passwordHash,
            emailVerified: true,
          },
        });

        await tx.candidate.create({ data: { userId: createdUser.id } });

        return createdUser;
      });
    }

    await createAuthCookies({ id: user.id, email: user.email, role: user.role });

    return successResponse({ id: user.id, email: user.email, role: user.role });
  } catch (error) {
    return handleApiError(error);
  }
}
