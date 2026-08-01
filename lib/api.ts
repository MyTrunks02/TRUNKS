import { NextResponse } from "next/server";
import { getAuthSession } from "./auth";
import type { AuthTokenPayload } from "./jwt";
import type { UserRole } from "./generated/prisma/enums";

/**
 * Thrown by `requireAuth`/`requireRole` and caught by `handleApiError` to
 * turn an auth failure into the right HTTP status without a try/catch in
 * every route handler.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * The shape every TRUNKS API route responds with: either a successful
 * payload or an error message, never both.
 */
export type APIResponse<T> = { success: true; data: T } | { success: false; error: string };

export function successResponse<T>(data: T, status = 200): NextResponse<APIResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400): NextResponse<APIResponse<never>> {
  return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * Converts any error thrown inside a route handler into a JSON error
 * response. Use as the `catch` in every Route Handler:
 *
 * ```ts
 * try {
 *   const session = await requireRole(UserRole.RECRUITER);
 *   // ...
 * } catch (error) {
 *   return handleApiError(error);
 * }
 * ```
 */
export function handleApiError(error: unknown): NextResponse<APIResponse<never>> {
  if (error instanceof ApiError) {
    return errorResponse(error.message, error.status);
  }

  console.error("Unhandled API error:", error);
  return errorResponse("Internal server error", 500);
}

/**
 * Resolves the authenticated session for the current request (transparently
 * refreshing an expired access token, see `lib/auth.ts`), throwing a 401
 * `ApiError` if the visitor is not signed in.
 */
export async function requireAuth(): Promise<AuthTokenPayload> {
  const session = await getAuthSession();

  if (!session) {
    throw new ApiError("Authentication required", 401);
  }

  return session;
}

/**
 * Like `requireAuth`, but also throws a 403 `ApiError` if the authenticated
 * user's role isn't one of `allowedRoles`.
 */
export async function requireRole(...allowedRoles: UserRole[]): Promise<AuthTokenPayload> {
  const session = await requireAuth();

  if (!allowedRoles.includes(session.role)) {
    throw new ApiError("Insufficient permissions", 403);
  }

  return session;
}
