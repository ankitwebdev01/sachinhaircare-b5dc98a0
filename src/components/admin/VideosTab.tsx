import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { allTrendingVideosQuery, type TrendingVideo } from "@/lib/store";

const MAX_VIDEOS = 10;

const field = "mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
const label = "text-xs tracking-[0.16em] text-muted-foreground uppercase";

export function VideosTab() {
  const queryClient = useQueryClient();
  const { data: videos = [] } = useQuery(allTrendingVideosQuery);
  const [drafts, setDrafts] = useState<Record<string, Partial<TrendingVideo>>>({});

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["trending_videos"] });

  const save = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<TrendingVideo> }) => {
      const { error } = await supabase.from("trending_videos").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Video updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const create = useMutation({
    mutationFn: async () => {
      if (videos.length >= MAX_VIDEOS) throw new Error(`Maximum ${MAX_VIDEOS} videos — remove one first`);
      const { error } = await supabase.from("trending_videos").insert({
        title: "",
        thumbnail_url: "",
        video_url: "",
        link_href: "/shop",
        sort_order: videos.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Video slot added — fill in the details below");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trending_videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Video removed");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const valueOf = (video: TrendingVideo, key: keyof TrendingVideo) => (drafts[video.id]?.[key] ?? video[key]) as string;
  const setValue = (id: string, key: keyof TrendingVideo, value: string | boolean | number) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [key]: value } }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Trending videos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {videos.length}/{MAX_VIDEOS} slots used — up to 10 videos show on the home page rail.
          </p>
        </div>
        <button
          type="button"
          onClick={() => create.mutate()}
          disabled={videos.length >= MAX_VIDEOS}
          className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs tracking-[0.2em] text-primary-foreground uppercase disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" /> Add video
        </button>
      </div>

      <div className="space-y-6">
        {videos.map((video, idx) => (
          <div key={video.id} className="grid gap-5 border border-border bg-card p-7 md:grid-cols-2">
            <div className="flex items-center justify-between md:col-span-2">
              <div className="flex items-center gap-4">
                {video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt={video.title} className="h-28 w-16 rounded object-cover" />
                ) : (
                  <div className="grid h-28 w-16 place-items-center rounded border border-dashed border-border text-[0.6rem] text-muted-foreground">
                    No thumb
                  </div>
                )}
                <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Video {idx + 1}</p>
              </div>
              <button type="button" aria-label="Delete video" onClick={() => remove.mutate(video.id)} className="border border-border p-2.5 text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
            <div>
              <span className={label}>Title (shown on the card)</span>
              <input className={field} value={valueOf(video, "title")} onChange={(e) => setValue(video.id, "title", e.target.value)} />
            </div>
            <div>
              <span className={label}>Thumbnail image address (9:16 works best)</span>
              <input className={field} value={valueOf(video, "thumbnail_url")} onChange={(e) => setValue(video.id, "thumbnail_url", e.target.value)} />
            </div>
            <div>
              <span className={label}>Video link (YouTube / Reel / mp4)</span>
              <input className={field} value={valueOf(video, "video_url")} onChange={(e) => setValue(video.id, "video_url", e.target.value)} />
            </div>
            <div>
              <span className={label}>Tap goes to</span>
              <select className={field} value={valueOf(video, "link_href")} onChange={(e) => setValue(video.id, "link_href", e.target.value)}>
                <option value="/shop">Shop page</option>
                <option value="/contact">Contact page</option>
                <option value="/about">About page</option>
                <option value="/">Home page</option>
              </select>
            </div>
            <div>
              <span className={label}>Order (1 = first)</span>
              <input
                type="number"
                min={1}
                className={field}
                value={Number(drafts[video.id]?.sort_order ?? video.sort_order)}
                onChange={(e) => setValue(video.id, "sort_order", Number(e.target.value))}
              />
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={Boolean(drafts[video.id]?.is_active ?? video.is_active)}
                onChange={(e) => setValue(video.id, "is_active", e.target.checked)}
              />
              Show on website
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => save.mutate({ id: video.id, values: drafts[video.id] ?? {} })}
                className="bg-ink px-7 py-3 text-xs tracking-[0.2em] text-[color:var(--sand)] uppercase"
              >
                Save video
              </button>
            </div>
          </div>
        ))}
        {!videos.length ? <p className="text-sm text-muted-foreground">No videos yet — add your first slot above.</p> : null}
      </div>
    </div>
  );
}
