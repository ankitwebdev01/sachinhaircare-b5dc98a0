import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { trendingVideosQuery, type TrendingVideo } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";

const MAX_VIDEOS = 10;
const AUTO_SLIDE_MIN = 6; // rail starts gliding once there are more videos than fit on screen
const AUTO_SLIDE_MS = 1800;
const placeholderCount = 5;

/** Uploaded files (and direct video links) always play on their own, in a loop. */
export function isVideoFile(url: string) {
  return /^\/api\/public\/media\/videos\//.test(url) || /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url);
}

/** Trending Videos — horizontally scrollable rail of auto-playing looping videos, max 10. */
export function TrendingVideos() {
  const { data: videos = [] } = useQuery(trendingVideosQuery);
  const rail = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const scroll = (dir: number) => rail.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  const shown = videos.slice(0, MAX_VIDEOS);
  const placeholders = Array.from({ length: shown.length ? 0 : placeholderCount });

  // When the rail is full, glide one video at a time every ~2s so every clip gets seen.
  useEffect(() => {
    if (shown.length < AUTO_SLIDE_MIN) return;
    const t = setInterval(() => {
      if (paused.current) return;
      const el = rail.current;
      if (!el) return;
      const first = el.firstElementChild as HTMLElement | null;
      const step = first ? first.offsetWidth + 16 : 240;
      const nearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - step / 2;
      if (nearEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: step, behavior: "smooth" });
    }, AUTO_SLIDE_MS);
    return () => clearInterval(t);
  }, [shown.length]);

  return (
    <section
      className="bg-secondary/50 py-16"
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Trending <span className="text-primary">Videos</span>
          </h2>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Previous videos" onClick={() => scroll(-1)} className="rounded-full border border-border bg-card p-2.5">
              <ArrowLeft className="size-4" />
            </button>
            <button type="button" aria-label="Next videos" onClick={() => scroll(1)} className="rounded-full border border-border bg-card p-2.5">
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <div ref={rail} className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {shown.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
          {placeholders.map((_, i) => (
            <PlaceholderCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoCard({ video }: { video: TrendingVideo }) {
  const src = (video.video_url || "").trim();

  // Uploaded clip (or a direct video link): plays itself, on loop, no tapping needed.
  if (src && isVideoFile(src)) {
    return (
      <div className="relative aspect-[9/16] w-44 shrink-0 snap-start overflow-hidden rounded-2xl bg-secondary shadow-md sm:w-52">
        <video
          src={src}
          poster={video.thumbnail_url || undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="size-full object-cover"
        />
        <div className="hero-veil pointer-events-none absolute inset-0" />
        {video.title ? (
          <span className="absolute inset-x-0 bottom-0 p-3 text-xs leading-snug text-[color:var(--sand)]">{video.title}</span>
        ) : null}
      </div>
    );
  }

  const href = src || video.link_href;
  return (
    <a
      href={href || "/shop"}
      target={src ? "_blank" : undefined}
      rel="noreferrer"
      className="group relative aspect-[9/16] w-44 shrink-0 snap-start overflow-hidden rounded-2xl bg-secondary shadow-md transition-transform hover:-translate-y-1 sm:w-52"
    >
      {video.thumbnail_url ? (
        <img src={video.thumbnail_url} alt={video.title || "Trending video"} loading="lazy" className="size-full object-cover" />
      ) : null}
      <div className="hero-veil absolute inset-0" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
          <Play className="size-5 fill-current" />
        </span>
      </span>
      {video.title ? (
        <span className="absolute inset-x-0 bottom-0 p-3 text-xs leading-snug text-[color:var(--sand)]">{video.title}</span>
      ) : null}
    </a>
  );
}

function PlaceholderCard() {
  return (
    <div className="flex aspect-[9/16] w-44 shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card text-center shadow-sm sm:w-52">
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary">
        <Play className="size-5 text-muted-foreground" />
      </span>
      <p className="px-4 text-xs text-muted-foreground">Video coming soon — added from the owner dashboard</p>
    </div>
  );
}
