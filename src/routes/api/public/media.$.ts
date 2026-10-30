import { createFileRoute } from "@tanstack/react-router";

const BUCKET = "media";
const ALLOWED = /\.(mp4|webm|mov|m4v|ogg|jpg|jpeg|png|webp|gif|avif)$/i;

/**
 * Public media gateway: /api/public/media/<path>
 * Redirects to a short-lived signed URL for files in the private "media"
 * storage bucket, so uploaded videos/photos can be shown on the public site
 * without exposing the bucket itself.
 */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path || path.includes("..") || !ALLOWED.test(path)) {
          return new Response("Not found", { status: 404 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from(BUCKET).createSignedUrl(path, 3600);
        if (error || !data?.signedUrl) {
          return new Response("Not found", { status: 404 });
        }
        return new Response(null, {
          status: 302,
          headers: { Location: data.signedUrl, "Cache-Control": "public, max-age=600" },
        });
      },
    },
  },
});
