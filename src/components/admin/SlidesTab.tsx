import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { allHeroSlidesQuery, type HeroSlide } from "@/lib/store";

const field = "mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
const label = "text-xs tracking-[0.16em] text-muted-foreground uppercase";

export function SlidesTab() {
  const queryClient = useQueryClient();
  const { data: slides = [] } = useQuery(allHeroSlidesQuery);
  const [drafts, setDrafts] = useState<Record<string, Partial<HeroSlide>>>({});

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["hero_slides"] });

  const save = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<HeroSlide> }) => {
      const { error } = await supabase.from("hero_slides").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Slide updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("hero_slides").insert({
        title: "New advertisement",
        subtitle: "Describe the offer here.",
        eyebrow: "Sachin Family Salon",
        cta_label: "Shop now",
        cta_href: "/shop",
        image_url: "/images/hero-1.jpg",
        sort_order: slides.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Slide added");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("hero_slides").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Slide removed");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const valueOf = (slide: HeroSlide, key: keyof HeroSlide) => (drafts[slide.id]?.[key] ?? slide[key]) as string;
  const setValue = (id: string, key: keyof HeroSlide, value: string | boolean | number) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [key]: value } }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl">Hero advertisements</h2>
        <button
          type="button"
          onClick={() => create.mutate()}
          className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs tracking-[0.2em] text-primary-foreground uppercase"
        >
          <Plus className="size-4" /> Add slide
        </button>
      </div>

      <div className="space-y-6">
        {slides.map((slide) => (
          <div key={slide.id} className="grid gap-5 border border-border bg-card p-7 md:grid-cols-2">
            <div className="md:col-span-2 flex items-center justify-between">
              <img src={valueOf(slide, "image_url")} alt={slide.title} className="h-20 w-36 object-cover" />
              <button type="button" aria-label="Delete slide" onClick={() => remove.mutate(slide.id)} className="border border-border p-2.5 text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
            <div>
              <span className={label}>Small label</span>
              <input className={field} value={valueOf(slide, "eyebrow")} onChange={(e) => setValue(slide.id, "eyebrow", e.target.value)} />
            </div>
            <div>
              <span className={label}>Image address</span>
              <input className={field} value={valueOf(slide, "image_url")} onChange={(e) => setValue(slide.id, "image_url", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <span className={label}>Headline</span>
              <input className={field} value={valueOf(slide, "title")} onChange={(e) => setValue(slide.id, "title", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <span className={label}>Subtext</span>
              <textarea rows={2} className={field} value={valueOf(slide, "subtitle")} onChange={(e) => setValue(slide.id, "subtitle", e.target.value)} />
            </div>
            <div>
              <span className={label}>Button text</span>
              <input className={field} value={valueOf(slide, "cta_label")} onChange={(e) => setValue(slide.id, "cta_label", e.target.value)} />
            </div>
            <div>
              <span className={label}>Button link</span>
              <select
                className={field}
                value={valueOf(slide, "cta_href")}
                onChange={(e) => setValue(slide.id, "cta_href", e.target.value)}
              >
                <option value="/shop">Shop page</option>
                <option value="/contact">Contact page</option>
                <option value="/about">About page</option>
                <option value="/">Home page</option>
              </select>
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={Boolean(drafts[slide.id]?.is_active ?? slide.is_active)}
                onChange={(e) => setValue(slide.id, "is_active", e.target.checked)}
              />
              Show this slide
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => save.mutate({ id: slide.id, values: drafts[slide.id] ?? {} })}
                className="bg-ink px-7 py-3 text-xs tracking-[0.2em] text-[color:var(--sand)] uppercase"
              >
                Save slide
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
