import { clearAuthCookies } from "@/lib/auth";
import { successResponse, handleApiError } from "@/lib/api";

export async function POST() {
  try {
    await clearAuthCookies();
    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}
