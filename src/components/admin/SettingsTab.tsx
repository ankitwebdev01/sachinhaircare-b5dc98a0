import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/store";
import { waLink, waMessage } from "@/lib/whatsapp";

const field = "mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
const label = "text-xs tracking-[0.16em] text-muted-foreground uppercase";

export function SettingsTab() {
  const queryClient = useQueryClient();
  const { data: settings } = useQuery(settingsQuery);
  const [draft, setDraft] = useState({
    salon_name: "",
    tagline: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (!settings) return;
    setDraft({
      salon_name: settings.salon_name,
      tagline: settings.tagline,
      phone: settings.phone,
      whatsapp: settings.whatsapp,
      email: settings.email,
      address: settings.address,
    });
  }, [settings]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("site_settings").update(draft).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Salon details updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl">Salon details</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The WhatsApp number below is where every enquiry, booking and cart on the website is sent.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="grid gap-5 border border-border bg-card p-7 md:grid-cols-2"
      >
        <div>
          <span className={label}>Business name</span>
          <input className={field} value={draft.salon_name} onChange={(e) => setDraft({ ...draft, salon_name: e.target.value })} />
        </div>
        <div>
          <span className={label}>Tagline</span>
          <input className={field} value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} />
        </div>
        <div>
          <span className={label}>Phone shown on the site</span>
          <input className={field} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
        </div>
        <div>
          <span className={label}>WhatsApp number (with 91, digits only)</span>
          <input className={field} value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} />
        </div>
        <div>
          <span className={label}>Email</span>
          <input className={field} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
        </div>
        <div>
          <span className={label}>Address</span>
          <input className={field} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
        </div>
        <div className="flex flex-wrap items-center gap-4 md:col-span-2">
          <button
            type="submit"
            disabled={save.isPending}
            className="bg-ink px-7 py-3 text-xs tracking-[0.2em] text-[color:var(--sand)] uppercase disabled:opacity-50"
          >
            {save.isPending ? "Saving…" : "Save details"}
          </button>
          <a
            href={waLink(draft.whatsapp, waMessage.general(draft.salon_name))}
            target="_blank"
            rel="noreferrer"
            className="border border-border px-7 py-3 text-xs tracking-[0.2em] uppercase"
          >
            Test the WhatsApp link
          </a>
        </div>
      </form>
    </div>
  );
}
