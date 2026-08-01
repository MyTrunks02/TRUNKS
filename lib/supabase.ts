import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const RESUME_BUCKET = "resumes";

// Resume uploads/deletes run server-side and need to bypass Storage RLS
// policies, so this uses the service role key rather than the public anon
// key that the rest of the app uses for the browser Supabase client.
function getStorageClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase storage is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

export interface UploadResumeResult {
  path: string;
  publicUrl: string;
}

/**
 * Uploads a candidate's resume file, storing it under `<candidateId>/<timestamp>.<ext>`
 * so re-uploads never collide with another candidate's file.
 */
export async function uploadResume(candidateId: string, file: File): Promise<UploadResumeResult> {
  const supabase = getStorageClient();
  const extension = file.name.split(".").pop() ?? "pdf";
  const path = `${candidateId}/${Date.now()}.${extension}`;

  const { error } = await supabase.storage.from(RESUME_BUCKET).upload(path, file, {
    contentType: file.type || "application/pdf",
    upsert: true,
  });

  if (error) {
    throw new Error(`Failed to upload resume: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(RESUME_BUCKET).getPublicUrl(path);

  return { path, publicUrl };
}

/**
 * Deletes a previously uploaded resume by its storage path (see
 * `extractResumePath` to recover the path from a stored `Candidate.resumeUrl`).
 */
export async function deleteResume(path: string): Promise<void> {
  const supabase = getStorageClient();
  const { error } = await supabase.storage.from(RESUME_BUCKET).remove([path]);

  if (error) {
    throw new Error(`Failed to delete resume: ${error.message}`);
  }
}

/**
 * Recovers the storage path from a public resume URL, e.g. to delete the
 * previous file before uploading a replacement. Returns `null` if the URL
 * isn't a resume-bucket public URL.
 */
export function extractResumePath(resumeUrl: string): string | null {
  const marker = `/object/public/${RESUME_BUCKET}/`;
  const index = resumeUrl.indexOf(marker);
  return index === -1 ? null : resumeUrl.slice(index + marker.length);
}
