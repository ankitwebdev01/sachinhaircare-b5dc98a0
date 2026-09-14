import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCart } from "@/lib/cart";
import { formatINR, settingsQuery } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Sachin Unisex Salon" },
      { name: "description", content: "Place your order with cash on delivery or confirm it over WhatsApp." },
      { property: "og:title", content: "Checkout — Sachin Unisex Salon" },
      { property: "og:description", content: "Cash on delivery and WhatsApp confirmation available." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { data: settings } = useQuery(settingsQuery);
  const navigate = useNavigate();
  const [method, setMethod] = useState<"cod" | "whatsapp">("cod");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  const update = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (lines.length === 0) {
      toast.error("Your bag is empty");
      return;
    }
    setSaving(true);
    const { data: order, error } = await supabase
      .from("orders")
      .insert({ ...form, payment_method: method, total: subtotal })
      .select("id, order_number")
      .single();

    if (error || !order) {
      setSaving(false);
      toast.error("We couldn't place the order. Please try again or call us.");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      lines.map((line) => ({
        order_id: order.id,
        product_id: line.id,
        product_name: line.name,
        unit_price: line.price,
        quantity: line.quantity,
      })),
    );
    setSaving(false);
    if (itemsError) {
      toast.error("Order saved but items failed. Please call us to confirm.");
      return;
    }

    if (method === "whatsapp" && settings?.whatsapp) {
      const message = [
        `Hi ${settings.salon_name}, I placed order ${order.order_number}.`,
        "",
        ...lines.map((l) => `• ${l.name} × ${l.quantity} — ${formatINR(l.price * l.quantity)}`),
        "",
        `Total: ${formatINR(subtotal)}`,
        `Name: ${form.customer_name}`,
        `Phone: ${form.phone}`,
        `Address: ${form.address}, ${form.city} ${form.pincode}`,
      ].join("\n");
      window.open(`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
    }

    clear();
    toast.success(`Order ${order.order_number} placed. We'll call you to confirm.`);
    navigate({ to: "/" });
  };

  const field = "mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";
  const label = "text-xs tracking-[0.18em] text-muted-foreground uppercase";

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="font-display text-4xl md:text-5xl">Checkout</h1>

        {lines.length === 0 ? (
          <div className="mt-10 border border-border p-14 text-center">
            <p className="text-muted-foreground">There's nothing to check out yet.</p>
            <Link to="/shop" className="mt-7 inline-block bg-primary px-8 py-4 text-xs tracking-[0.26em] text-primary-foreground uppercase">
              Browse products
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_330px]">
            <div className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <span className={label}>Full name</span>
                  <input required className={field} value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} />
                </div>
                <div>
                  <span className={label}>Phone</span>
                  <input required className={field} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>
              </div>
              <div>
                <span className={label}>Email (optional)</span>
                <input type="email" className={field} value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <span className={label}>Address</span>
                <textarea required rows={3} className={field} value={form.address} onChange={(e) => update("address", e.target.value)} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <span className={label}>City</span>
                  <input required className={field} value={form.city} onChange={(e) => update("city", e.target.value)} />
                </div>
                <div>
                  <span className={label}>Pincode</span>
                  <input required className={field} value={form.pincode} onChange={(e) => update("pincode", e.target.value)} />
                </div>
              </div>
              <div>
                <span className={label}>Notes for the salon (optional)</span>
                <textarea rows={2} className={field} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
              </div>

              <fieldset className="border border-border p-6">
                <legend className="px-2 text-xs tracking-[0.2em] uppercase">How would you like to pay?</legend>
                {[
                  { key: "cod" as const, title: "Cash on delivery", copy: "Pay the courier when your order arrives." },
                  { key: "whatsapp" as const, title: "Confirm on WhatsApp", copy: "We'll message you to confirm and arrange payment." },
                ].map((option) => (
                  <label key={option.key} className="mt-3 flex cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={method === option.key}
                      onChange={() => setMethod(option.key)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm">{option.title}</span>
                      <span className="block text-sm text-muted-foreground">{option.copy}</span>
                    </span>
                  </label>
                ))}
                <p className="mt-4 text-xs text-muted-foreground">
                  Online card / UPI payment will switch on as soon as the salon shares its payment gateway details.
                </p>
              </fieldset>
            </div>

            <aside className="h-fit border border-border bg-card p-7">
              <p className="text-xs tracking-[0.24em] uppercase">Your order</p>
              <div className="mt-6 space-y-4">
                {lines.map((line) => (
                  <div key={line.id} className="flex justify-between gap-4 text-sm">
                    <span>
                      {line.name} <span className="text-muted-foreground">× {line.quantity}</span>
                    </span>
                    <span>{formatINR(line.price * line.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between border-t border-border pt-6 text-lg">
                <span>Total</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-7 w-full bg-primary py-4 text-xs tracking-[0.26em] text-primary-foreground uppercase disabled:opacity-50"
              >
                {saving ? "Placing order…" : "Place order"}
              </button>
            </aside>
          </form>
        )}
      </div>
    </SiteLayout>
  );
}
