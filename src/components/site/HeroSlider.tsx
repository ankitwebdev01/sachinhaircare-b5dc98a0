import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { HeroSlide } from "@/lib/store";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const go = (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-ink">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <img
            src={slide.image_url}
            alt={slide.title}
            className="size-full object-cover"
            style={{ transform: i === index ? "scale(1.06)" : "scale(1)", transition: "transform 7s linear" }}
          />
          <div className="hero-veil absolute inset-0" />
        </div>
      ))}

      <div className="relative mx-auto flex h-full max-w-7xl items-center px-5">
        <div key={index} className="fade-rise max-w-xl text-[color:var(--sand)]">
          <p className="text-xs tracking-[0.4em] uppercase opacity-80">{slides[index]!.eyebrow}</p>
          <div className="gold-rule mt-5" />
          <h1 className="mt-6 font-display text-5xl leading-[1.05] font-semibold md:text-6xl">
            {slides[index]!.title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed opacity-85">{slides[index]!.subtitle}</p>
          <Link
            to={slides[index]!.cta_href as "/shop"}
            className="mt-9 inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs tracking-[0.28em] text-primary-foreground uppercase transition-transform hover:translate-x-1"
          >
            {slides[index]!.cta_label}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {slides.length > 1 ? (
        <div className="absolute right-5 bottom-8 flex items-center gap-4 text-[color:var(--sand)] md:right-12">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="rounded-full border border-white/30 p-3 transition-colors hover:border-primary"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className="h-[2px] w-9 transition-colors"
                style={{ background: i === index ? "var(--gold)" : "rgb(255 255 255 / 0.35)" }}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="rounded-full border border-white/30 p-3 transition-colors hover:border-primary"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
