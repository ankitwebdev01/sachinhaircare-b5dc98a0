import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/store";
import { FESTIVE_PRESETS, type FestivePreset } from "@/lib/festivals";

const label = "text-xs tracking-[0.16em] text-muted-foreground uppercase";

export function ThemeTab() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery(settingsQuery);
  const [draft, setDraft] = useState({
    theme_name: "signature",
    theme_primary: "#b8863b",
    theme_accent: "#7a1f2b",
    theme_background: "#fbf8f3",
    announcement: "",
    announcement_active: true,
  });

  useEffect(() => {
    if (!settings) return;
    setDraft({
      theme_name: settings.theme_name,
      theme_primary: settings.theme_primary,
      theme_accent: settings.theme_accent,
      theme_background: settings.theme_background,
      announcement: settings.announcement,
      announcement_active: settings.announcement_active,
    });
  }, [settings]);

  const save = useMutation({
    mutationFn: async (values: typeof draft) => {
      const { error } = await supabase.from("site_settings").update(values).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Theme updated across the website");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const applyPreset = (preset: FestivePreset) => {
    const values = {
      theme_name: preset.key,
      theme_primary: preset.primary,
      theme_accent: preset.accent,
      theme_background: preset.background,
      announcement: preset.announcement,
      announcement_active: true,
    };
    setDraft(values);
    save.mutate(values);
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-3xl">Festive themes &amp; sale campaigns</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a festival and the website colours plus the scrolling offer bar change instantly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {FESTIVE_PRESETS.map((preset) => {
          const active = draft.theme_name === preset.key;
          return (
            <button
              key={preset.key}
              type="button"
              onClick={() => applyPreset(preset)}
              className="border p-5 text-left transition-colors"
              style={{ borderColor: active ? preset.primary : "var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm">{preset.name}</p>
                {active ? <Check className="size-4" style={{ color: preset.primary }} /> : null}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{preset.when}</p>
              <div className="mt-4 flex gap-2">
                {[preset.primary, preset.accent, preset.background].map((c) => (
                  <span key={c} className="size-7 rounded-full border border-border" style={{ background: c }} />
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{preset.announcement}</p>
            </button>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate(draft);
        }}
        className="grid gap-5 border border-border bg-card p-7 md:grid-cols-3"
      >
        <p className="md:col-span-3 font-display text-2xl">Fine-tune the colours</p>
        {[
          { key: "theme_primary" as const, title: "Main colour (buttons, highlights)" },
          { key: "theme_accent" as const, title: "Accent colour (sale badges)" },
          { key: "theme_background" as const, title: "Page background" },
        ].map((row) => (
          <div key={row.key}>
            <span className={label}>{row.title}</span>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="color"
                value={draft[row.key]}
                onChange={(e) => setDraft({ ...draft, [row.key]: e.target.value, theme_name: "custom" })}
                className="size-11 border border-border bg-background"
              />
              <input
                value={draft[row.key]}
                onChange={(e) => setDraft({ ...draft, [row.key]: e.target.value, theme_name: "custom" })}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        ))}

        <div className="md:col-span-3">
          <span className={label}>Offer bar text (scrolls at the top of every page)</span>
          <input
            className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            value={draft.announcement}
            onChange={(e) => setDraft({ ...draft, announcement: e.target.value })}
          />
        </div>
        <label className="flex items-center gap-3 text-sm md:col-span-2">
          <input
            type="checkbox"
            checked={draft.announcement_active}
            onChange={(e) => setDraft({ ...draft, announcement_active: e.target.checked })}
          />
          Show the offer bar
        </label>
        <button
          type="submit"
          disabled={save.isPending}
          className="bg-ink px-7 py-3 text-xs tracking-[0.2em] text-[color:var(--sand)] uppercase disabled:opacity-50"
        >
          {save.isPending ? "Saving…" : "Save theme"}
        </button>
      </form>
    </div>
  );
}
