import { cookies } from "next/headers";
import { hash, compare } from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  type AuthTokenPayload,
} from "./jwt";
import { prisma } from "./prisma";
import type { UserRole } from "./generated/prisma/enums";

export const ACCESS_COOKIE_NAME = "trunks_session";
export const REFRESH_COOKIE_NAME = "trunks_refresh";

const SALT_ROUNDS = 12;
const ACCESS_COOKIE_MAX_AGE_SECONDS = 60 * 15; // 15 minutes, matches the access token expiry in lib/jwt.ts
const REFRESH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days, matches the refresh token expiry

/**
 * Hashes a plaintext password for storage in `User.passwordHash`.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compares a plaintext password against a stored hash.
 */
export async function verifyPassword(plainPassword: string, passwordHash: string): Promise<boolean> {
  return compare(plainPassword, passwordHash);
}

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

/**
 * Signs a fresh access + refresh token pair for the given user and sets them
 * as httpOnly cookies. Call this from a Server Action or Route Handler
 * (Server Components cannot set cookies).
 */
export async function createAuthCookies(user: { id: string; email: string; role: UserRole }): Promise<void> {
  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id });
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE_NAME, accessToken, {
    ...baseCookieOptions(),
    maxAge: ACCESS_COOKIE_MAX_AGE_SECONDS,
  });

  cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, {
    ...baseCookieOptions(),
    maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS,
  });
}

/**
 * Clears both session cookies, logging the current user out.
 */
export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}

/**
 * Reads and verifies only the access token cookie. Returns `null` if it's
 * missing, expired, or invalid — use `getAuthSession` for a version that
 * transparently falls back to the refresh token.
 */
export async function getAccessSession(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  return token ? verifyAccessToken(token) : null;
}

/**
 * Resolves the current session. If the access token is missing or expired
 * but a valid refresh token cookie is present, mints and sets a new access
 * token so the caller doesn't have to handle re-authentication on every
 * 15-minute expiry. Returns `null` only when both tokens are absent/invalid.
 *
 * Must be called from a Server Action or Route Handler when it needs to
 * refresh, since that's where cookies can be set.
 */
export async function getAuthSession(): Promise<AuthTokenPayload | null> {
  const accessSession = await getAccessSession();

  if (accessSession) {
    return accessSession;
  }

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return null;
  }

  const refreshClaims = verifyRefreshToken(refreshToken);

  if (!refreshClaims) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: refreshClaims.userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    return null;
  }

  const payload: AuthTokenPayload = { userId: user.id, email: user.email, role: user.role };

  cookieStore.set(ACCESS_COOKIE_NAME, signAccessToken(payload), {
    ...baseCookieOptions(),
    maxAge: ACCESS_COOKIE_MAX_AGE_SECONDS,
  });

  return payload;
}
