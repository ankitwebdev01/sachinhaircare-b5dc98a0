import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatINR, ordersQuery } from "@/lib/store";
import { waLink } from "@/lib/whatsapp";

const statuses = ["pending", "confirmed", "delivered", "cancelled"];

export function OrdersTab() {
  const queryClient = useQueryClient();
  const { data: orders = [] } = useQuery(ordersQuery);

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order updated");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-8">
      <h2 className="font-display text-3xl">Orders &amp; enquiries</h2>

      {orders.length === 0 ? (
        <p className="border border-border bg-card p-14 text-center text-sm text-muted-foreground">
          No saved orders yet. Customers now book straight on WhatsApp, so new enquiries arrive in your chats.
        </p>
      ) : (
        <div className="border border-border bg-card">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center gap-4 border-b border-border p-5 last:border-b-0">
              <div className="min-w-56 flex-1">
                <p className="text-sm">
                  {order.order_number} · {order.customer_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.phone} · {order.city} · {new Date(order.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>
              <span className="text-sm">{formatINR(Number(order.total))}</span>
              <select
                value={order.status}
                onChange={(e) => update.mutate({ id: order.id, status: e.target.value })}
                className="border border-border bg-background px-3 py-2 text-xs tracking-[0.14em] uppercase"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <a
                href={waLink(order.phone, `Hello ${order.customer_name}, this is about your order ${order.order_number}.`)}
                target="_blank"
                rel="noreferrer"
                className="border border-border px-4 py-2 text-xs tracking-[0.14em] uppercase"
              >
                WhatsApp
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
