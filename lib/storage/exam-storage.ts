import path from "path";
import fs from "fs/promises";
import fsSync from "fs";

export interface UploadAssetOptions {
  buffer: Buffer;
  filename: string;
  contentType?: string;
  subfolder?: string;
}

export interface UploadAssetResult {
  url: string;
  provider: "supabase" | "local";
}

/**
 * Universal Exam Asset Storage Driver
 * Automatically uploads to Supabase Storage bucket 'exam-assets' if configured with a real cloud URL.
 * Gracefully falls back to local 'public/images/exam-assets/' for local dev or offline mode.
 */
export async function uploadExamAsset({
  buffer,
  filename,
  contentType = "image/png",
  subfolder = "ce",
}: UploadAssetOptions): Promise<UploadAssetResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const remotePath = `${subfolder}/${cleanFilename}`;

  // Check if real Supabase Cloud is configured
  const isCloudSupabase =
    supabaseUrl &&
    supabaseUrl.startsWith("https://") &&
    serviceKey &&
    !serviceKey.includes("fake");

  if (isCloudSupabase) {
    try {
      const bucket = "exam-assets";
      const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${remotePath}`;

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
          "Content-Type": contentType,
          "x-upsert": "true",
        },
        body: new Uint8Array(buffer),
      });

      if (res.ok) {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${remotePath}`;
        return {
          url: publicUrl,
          provider: "supabase",
        };
      } else {
        console.warn("Supabase Storage upload returned status:", res.status, await res.text());
      }
    } catch (err) {
      console.warn("Supabase Storage upload failed, falling back to local:", err);
    }
  }

  // Local fallback: write to public/images/exam-assets/{subfolder}
  const publicDir = path.join(process.cwd(), "public", "images", "exam-assets", subfolder);
  if (!fsSync.existsSync(publicDir)) {
    fsSync.mkdirSync(publicDir, { recursive: true });
  }

  const filePath = path.join(publicDir, cleanFilename);
  await fs.writeFile(filePath, buffer);

  const localUrl = `/images/exam-assets/${subfolder}/${cleanFilename}`;
  return {
    url: localUrl,
    provider: "local",
  };
}
