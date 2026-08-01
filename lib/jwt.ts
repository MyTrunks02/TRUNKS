import { sign, verify, type SignOptions } from "jsonwebtoken";
import type { UserRole } from "./generated/prisma/enums";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
}

const JWT_SECRET = requireEnv("JWT_SECRET");

const ACCESS_TOKEN_EXPIRY: SignOptions["expiresIn"] = "15m";
const REFRESH_TOKEN_EXPIRY: SignOptions["expiresIn"] = "7d";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  userId: string;
}

// A `type` claim keeps a refresh token from being accepted where an access
// token is expected (and vice versa), since both are signed with the same
// JWT_SECRET.
interface AccessTokenClaims extends AuthTokenPayload {
  type: "access";
}

interface RefreshTokenClaims extends RefreshTokenPayload {
  type: "refresh";
}

/**
 * Signs a 15-minute access token embedding the user's id, email, and role.
 */
export function signAccessToken(payload: AuthTokenPayload): string {
  const claims: AccessTokenClaims = { ...payload, type: "access" };
  return sign(claims, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

/**
 * Signs a 7-day refresh token used only to mint new access tokens.
 */
export function signRefreshToken(payload: RefreshTokenPayload): string {
  const claims: RefreshTokenClaims = { ...payload, type: "refresh" };
  return sign(claims, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

/**
 * Verifies an access token, returning its payload or `null` if it's missing,
 * expired, has an invalid signature, or is actually a refresh token.
 */
export function verifyAccessToken(token: string): AuthTokenPayload | null {
  try {
    const decoded = verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return null;
    }

    const { type, userId, email, role } = decoded as Partial<AccessTokenClaims>;

    if (type !== "access" || !userId || !email || !role) {
      return null;
    }

    return { userId, email, role };
  } catch {
    return null;
  }
}

/**
 * Verifies a refresh token, returning its payload or `null` if it's missing,
 * expired, has an invalid signature, or is actually an access token.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    const decoded = verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return null;
    }

    const { type, userId } = decoded as Partial<RefreshTokenClaims>;

    if (type !== "refresh" || !userId) {
      return null;
    }

    return { userId };
  } catch {
    return null;
  }
}
