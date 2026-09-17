import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { allProductsQuery, formatINR, type Product } from "@/lib/store";

const empty = {
  name: "",
  slug: "",
  description: "",
  category: "Wigs",
  price: 0,
  compare_at_price: null as number | null,
  image_url: "",
  hair_length: "",
  hair_color: "",
  stock: 0,
  featured: false,
  is_active: true,
  sort_order: 0,
};

type Draft = typeof empty;

const field = "mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
const label = "text-xs tracking-[0.16em] text-muted-foreground uppercase";

export function ProductsTab() {
  const queryClient = useQueryClient();
  const { data: products = [] } = useQuery(allProductsQuery);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const save = useMutation({
    mutationFn: async (draft: Draft) => {
      const payload = {
        ...draft,
        slug: draft.slug || draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        compare_at_price: draft.compare_at_price || null,
        hair_length: draft.hair_length || null,
        hair_color: draft.hair_color || null,
      };
      const { error } = editingId
        ? await supabase.from("products").update(payload).eq("id", editingId)
        : await supabase.from("products").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setEditing(null);
      setEditingId(null);
      toast.success("Product saved");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Product deleted");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditing({
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: Number(product.price),
      compare_at_price: product.compare_at_price ? Number(product.compare_at_price) : null,
      image_url: product.image_url,
      hair_length: product.hair_length ?? "",
      hair_color: product.hair_color ?? "",
      stock: product.stock,
      featured: product.featured,
      is_active: product.is_active,
      sort_order: product.sort_order,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl">Products</h2>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setEditing({ ...empty, sort_order: products.length + 1 });
          }}
          className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs tracking-[0.2em] text-primary-foreground uppercase"
        >
          <Plus className="size-4" /> New product
        </button>
      </div>

      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(editing);
          }}
          className="grid gap-5 border border-border bg-card p-7 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <span className={label}>Product name</span>
            <input required className={field} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <span className={label}>Description</span>
            <textarea rows={3} className={field} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          </div>
          <div>
            <span className={label}>Category</span>
            <input className={field} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
          </div>
          <div>
            <span className={label}>Image address</span>
            <input
              className={field}
              placeholder="/images/product-wig-wave.jpg or a link"
              value={editing.image_url}
              onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
            />
          </div>
          <div>
            <span className={label}>Price (₹)</span>
            <input type="number" min={0} className={field} value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} />
          </div>
          <div>
            <span className={label}>Was price (₹, optional)</span>
            <input
              type="number"
              min={0}
              className={field}
              value={editing.compare_at_price ?? ""}
              onChange={(e) => setEditing({ ...editing, compare_at_price: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
          <div>
            <span className={label}>Length</span>
            <input className={field} value={editing.hair_length} onChange={(e) => setEditing({ ...editing, hair_length: e.target.value })} />
          </div>
          <div>
            <span className={label}>Colour</span>
            <input className={field} value={editing.hair_color} onChange={(e) => setEditing({ ...editing, hair_color: e.target.value })} />
          </div>
          <div>
            <span className={label}>Stock</span>
            <input type="number" min={0} className={field} value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
          </div>
          <div>
            <span className={label}>Display order</span>
            <input type="number" className={field} value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
            Show on home page
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
            Visible in shop
          </label>
          <div className="flex gap-3 md:col-span-2">
            <button type="submit" disabled={save.isPending} className="bg-ink px-7 py-3 text-xs tracking-[0.2em] text-[color:var(--sand)] uppercase disabled:opacity-50">
              {save.isPending ? "Saving…" : "Save product"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setEditingId(null);
              }}
              className="border border-border px-7 py-3 text-xs tracking-[0.2em] uppercase"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="border border-border bg-card">
        {products.map((product) => (
          <div key={product.id} className="flex flex-wrap items-center gap-4 border-b border-border p-4 last:border-b-0">
            <img src={product.image_url} alt={product.name} className="size-14 object-cover" />
            <div className="min-w-48 flex-1">
              <p className="text-sm">{product.name}</p>
              <p className="text-xs text-muted-foreground">
                {product.category} · {product.stock} in stock {product.is_active ? "" : "· hidden"}
              </p>
            </div>
            <span className="text-sm">{formatINR(Number(product.price))}</span>
            <button type="button" aria-label="Edit" onClick={() => startEdit(product)} className="border border-border p-2.5">
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Delete"
              onClick={() => {
                if (window.confirm(`Delete ${product.name}?`)) remove.mutate(product.id);
              }}
              className="border border-border p-2.5 text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
