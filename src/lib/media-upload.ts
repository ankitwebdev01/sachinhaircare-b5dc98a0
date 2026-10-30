import { supabase } from "@/integrations/supabase/client";

const BUCKET = "media";

/** Upload a file from the owner's device into the media bucket; returns the site URL for it. */
export async function uploadMediaFile(file: File, folder: "videos" | "photos"): Promise<string> {
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, "-");
  const ext = safeName.includes(".") ? safeName.slice(safeName.lastIndexOf(".") + 1) : "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  return `/api/public/media/${path}`;
}

/** Best-effort delete of a previously uploaded media file behind its site URL. */
export async function deleteMediaFile(url: string | null | undefined) {
  if (!url) return;
  const marker = "/api/public/media/";
  const i = url.indexOf(marker);
  if (i === -1) return; // not our uploaded file (e.g. an external link) — leave it alone
  const path = url.slice(i + marker.length);
  if (!path || path.includes("..")) return;
  await supabase.storage.from(BUCKET).remove([path]);
}
