import { useRef } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { trendingVideosQuery, type TrendingVideo } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";

const MAX_VIDEOS = 10;
const placeholderCount = 5;

/** Trending Videos — horizontally scrollable collage rail, max 10 videos. */
export function TrendingVideos() {
  const { data: videos = [] } = useQuery(trendingVideosQuery);
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => rail.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  const shown = videos.slice(0, MAX_VIDEOS);
  const placeholders = Array.from({ length: shown.length ? 0 : placeholderCount });

  return (
    <section className="bg-secondary/50 py-16">
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
  const href = video.video_url || video.link_href;
  return (
    <a
      href={href || "/shop"}
      target={video.video_url ? "_blank" : undefined}
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
