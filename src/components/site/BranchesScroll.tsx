import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, MessageCircle } from "lucide-react";
import { settingsQuery } from "@/lib/store";
import { waLink, waMessage } from "@/lib/whatsapp";

export type Branch = { city: string; pincode: string; area: string };

export const BRANCHES: Branch[] = [
  { city: "Silvassa", pincode: "396230", area: "Amli Industrial Estate — flagship studio" },
  { city: "Vapi", pincode: "396191", area: "GIDC, near Gunjan Chowkdi" },
  { city: "Daman", pincode: "396210", area: "Nani Daman, near Devka Beach Road" },
  { city: "Surat", pincode: "395003", area: "Adajan, near Palanpur Patia" },
  { city: "Navsari", pincode: "396445", area: "Near Tower Road" },
  { city: "Valsad", pincode: "396001", area: "Near Railway Station Road" },
  { city: "Bilimora", pincode: "396321", area: "Near Station Road" },
  { city: "Bharuch", pincode: "392001", area: "Near Old GNFC Circle" },
  { city: "Ahmedabad", pincode: "380006", area: "Paldi, near Ellisbridge" },
  { city: "Vadodara", pincode: "390007", area: "Alkapuri, near Race Course" },
  { city: "Mumbai", pincode: "400001", area: "Fort, near CST" },
  { city: "Pune", pincode: "411001", area: "Camp, near East Street" },
];

/**
 * Scroll-controlled branches showcase: the section pins to the screen and the
 * row of branch cards slides sideways purely as the visitor scrolls.
 */
export function BranchesScroll() {
  const section = useRef<HTMLElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);
  const { data: settings } = useQuery(settingsQuery);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const sec = section.current;
      const tr = track.current;
      if (!sec || !tr) return;
      const scrollable = sec.offsetHeight - window.innerHeight;
      const progress =
        scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / scrollable));
      const wrap = tr.parentElement;
      if (!wrap) return;
      const max = Math.max(0, tr.scrollWidth - wrap.clientWidth);
      tr.style.transform = `translate3d(${(-progress * max).toFixed(1)}px, 0, 0)`;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.max(progress, 0.02)})`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const wa = settings?.whatsapp;
  const name = settings?.salon_name;

  return (
    <section ref={section} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-4 px-5">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">Now a family of 12</p>
            <h2 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
              Our <span className="text-primary">Branches</span>
            </h2>
          </div>
          <p className="flex items-center gap-2 text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Keep scrolling <span aria-hidden>→</span>
          </p>
        </div>

        <div className="mt-10 overflow-hidden">
          <div
            ref={track}
            className="flex w-max gap-6 will-change-transform pr-[10vw] pl-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))]"
          >
            {BRANCHES.map((b, i) => (
              <article
                key={b.city}
                className="flex h-[440px] w-64 shrink-0 flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-lg sm:w-72"
              >
                <div>
                  <p className="text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
                    Branch {String(i + 1).padStart(2, "0")}
                  </p>
                  <MapPin className="mt-8 size-7 text-primary" />
                  <h3 className="mt-4 font-display text-3xl leading-tight">
                    Sachin Salon <span className="text-primary">{b.city}</span>
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">({b.pincode})</p>
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{b.area}</p>
                  <p className="mt-3 text-xs text-muted-foreground">Open daily · 9 am – 9 pm</p>
                </div>
                <a
                  href={waLink(wa, waMessage.branch(b.city, name))}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--whatsapp)] px-5 py-2.5 text-xs font-medium text-[color:var(--sand)]"
                >
                  <MessageCircle className="size-3.5" /> WhatsApp this branch
                </a>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-7xl px-5">
          <div className="h-1 w-48 overflow-hidden rounded-full bg-border">
            <div ref={bar} className="h-full w-full origin-left rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}
