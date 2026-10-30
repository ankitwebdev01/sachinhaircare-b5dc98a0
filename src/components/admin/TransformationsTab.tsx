import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { allTransformationsQuery, type Transformation } from "@/lib/store";
import { deleteMediaFile, uploadMediaFile } from "@/lib/media-upload";

const MAX_ITEMS = 10;
type MediaField = "before_url" | "after_url";

const field = "mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
const label = "text-xs tracking-[0.16em] text-muted-foreground uppercase";

type Row = { id: string; field: MediaField };

export function TransformationsTab() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery(allTransformationsQuery);
  const [drafts, setDrafts] = useState<Record<string, Partial<Transformation>>>({});

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["transformations"] });

  const save = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<Transformation> }) => {
      const { error } = await supabase.from("transformations").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Transformation updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const create = useMutation({
    mutationFn: async () => {
      if (items.length >= MAX_ITEMS) throw new Error(`Maximum ${MAX_ITEMS} transformations — remove one first`);
      const { error } = await supabase.from("transformations").insert({
        caption: "",
        before_url: "",
        after_url: "",
        sort_order: items.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Transformation slot added — upload the before & after photos below");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { data: row } = await supabase.from("transformations").select("before_url, after_url").eq("id", id).single();
      const { error } = await supabase.from("transformations").delete().eq("id", id);
      if (error) throw error;
      if (row) {
        void deleteMediaFile(row.before_url);
        void deleteMediaFile(row.after_url);
      }
    },
    onSuccess: () => {
      invalidate();
      toast.success("Transformation removed");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const upload = useMutation({
    mutationFn: async ({ id, field: f, file }: Row & { file: File }) => {
      const url = await uploadMediaFile(file, "photos");
      const { data: row } = await supabase.from("transformations").select(f).eq("id", id).single();
      const { error } = await supabase
        .from("transformations")
        .update({ [f]: url } as { before_url?: string; after_url?: string })
        .eq("id", id);
      if (error) {
        void deleteMediaFile(url);
        throw error;
      }
      const old = row ? (row[f] as string | null) : null;
      if (old) void deleteMediaFile(old);
    },
    onSuccess: (_d, v) => {
      invalidate();
      toast.success(`Photo uploaded to the ${v.field === "before_url" ? "before" : "after"} slot`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const clearMedia = useMutation({
    mutationFn: async ({ id, field: f }: Row) => {
      const { data: row } = await supabase.from("transformations").select(f).eq("id", id).single();
      const { error } = await supabase
        .from("transformations")
        .update({ [f]: "" } as { before_url?: string; after_url?: string })
        .eq("id", id);
      if (error) throw error;
      const old = row ? (row[f] as string | null) : null;
      if (old) void deleteMediaFile(old);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Photo removed");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const valueOf = (item: Transformation, key: keyof Transformation) => (drafts[item.id]?.[key] ?? item[key]) as string;
  const setValue = (id: string, key: keyof Transformation, value: string | boolean | number) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [key]: value } }));

  const isBusy = (r: Row) =>
    (upload.isPending || clearMedia.isPending) &&
    (upload.variables?.id === r.id || clearMedia.variables?.id === r.id) &&
    (upload.variables?.field === r.field || clearMedia.variables?.field === r.field);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Transformations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length}/{MAX_ITEMS} slots used — before &amp; after pairs slide automatically on the home page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => create.mutate()}
          disabled={items.length >= MAX_ITEMS}
          className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs tracking-[0.2em] text-primary-foreground uppercase disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="size-4" /> Add transformation
        </button>
      </div>

      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={item.id} className="grid gap-5 border border-border bg-card p-7 md:grid-cols-2">
            <div className="flex items-center justify-between md:col-span-2">
              <div className="flex items-center gap-3">
                {item.before_url ? (
                  <img src={item.before_url} alt="Before" className="h-20 w-16 rounded object-cover" />
                ) : (
                  <div className="grid h-20 w-16 place-items-center rounded border border-dashed border-border text-[0.55rem] text-muted-foreground">Before</div>
                )}
                {item.after_url ? (
                  <img src={item.after_url} alt="After" className="h-20 w-16 rounded object-cover" />
                ) : (
                  <div className="grid h-20 w-16 place-items-center rounded border border-dashed border-border text-[0.55rem] text-muted-foreground">After</div>
                )}
                <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Transformation {idx + 1}</p>
              </div>
              <button type="button" aria-label="Delete transformation" onClick={() => remove.mutate(item.id)} className="border border-border p-2.5 text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>

            <div>
              <span className={label}>Before photo</span>
              <input className={field} value={valueOf(item, "before_url")} onChange={(e) => setValue(item.id, "before_url", e.target.value)} placeholder="Upload from your device, or paste an image link" />
              <MediaControls
                value={valueOf(item, "before_url")}
                accept="image/*"
                busy={isBusy({ id: item.id, field: "before_url" })}
                onUpload={(file) => upload.mutate({ id: item.id, field: "before_url", file })}
                onRemove={() => clearMedia.mutate({ id: item.id, field: "before_url" })}
                removeLabel="Remove before photo"
              />
            </div>
            <div>
              <span className={label}>After photo</span>
              <input className={field} value={valueOf(item, "after_url")} onChange={(e) => setValue(item.id, "after_url", e.target.value)} placeholder="Upload from your device, or paste an image link" />
              <MediaControls
                value={valueOf(item, "after_url")}
                accept="image/*"
                busy={isBusy({ id: item.id, field: "after_url" })}
                onUpload={(file) => upload.mutate({ id: item.id, field: "after_url", file })}
                onRemove={() => clearMedia.mutate({ id: item.id, field: "after_url" })}
                removeLabel="Remove after photo"
              />
            </div>
            <div>
              <span className={label}>Caption (optional)</span>
              <input className={field} value={valueOf(item, "caption")} onChange={(e) => setValue(item.id, "caption", e.target.value)} />
            </div>
            <div>
              <span className={label}>Order (1 = first)</span>
              <input
                type="number"
                min={1}
                className={field}
                value={Number(drafts[item.id]?.sort_order ?? item.sort_order)}
                onChange={(e) => setValue(item.id, "sort_order", Number(e.target.value))}
              />
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={Boolean(drafts[item.id]?.is_active ?? item.is_active)}
                onChange={(e) => setValue(item.id, "is_active", e.target.checked)}
              />
              Show on website
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => save.mutate({ id: item.id, values: drafts[item.id] ?? {} })}
                className="bg-ink px-7 py-3 text-xs tracking-[0.2em] text-[color:var(--sand)] uppercase"
              >
                Save transformation
              </button>
            </div>
          </div>
        ))}
        {!items.length ? <p className="text-sm text-muted-foreground">No transformations yet — add your first slot above.</p> : null}
      </div>
    </div>
  );
}

function MediaControls({
  value,
  accept,
  busy,
  onUpload,
  onRemove,
  removeLabel,
}: {
  value: string;
  accept: string;
  busy: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-4 py-2 text-xs tracking-[0.14em] uppercase hover:border-primary">
        <Upload className="size-3.5" /> {busy ? "Uploading…" : "Upload from device"}
        <input
          type="file"
          accept={accept}
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = "";
            if (f) onUpload(f);
          }}
        />
      </label>
      {value ? (
        <button
          type="button"
          onClick={onRemove}
          disabled={busy}
          className="border border-border px-4 py-2 text-xs tracking-[0.14em] text-destructive uppercase disabled:opacity-40"
        >
          {removeLabel}
        </button>
      ) : null}
    </div>
  );
}
