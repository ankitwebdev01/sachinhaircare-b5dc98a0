import { useQuery } from "@tanstack/react-query";
import { IndianRupee, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { formatINR, ordersQuery, allProductsQuery } from "@/lib/store";

export function OverviewTab() {
  const { data: orders = [] } = useQuery(ordersQuery);
  const { data: products = [] } = useQuery(allProductsQuery);

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const previousCutoff = Date.now() - 60 * 24 * 60 * 60 * 1000;
  const cancelled = (status: string) => status === "cancelled";

  const last30 = orders.filter((o) => new Date(o.created_at).getTime() >= cutoff && !cancelled(o.status));
  const prev30 = orders.filter((o) => {
    const t = new Date(o.created_at).getTime();
    return t >= previousCutoff && t < cutoff && !cancelled(o.status);
  });

  const revenue = last30.reduce((sum, o) => sum + Number(o.total), 0);
  const prevRevenue = prev30.reduce((sum, o) => sum + Number(o.total), 0);
  const change = prevRevenue > 0 ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100) : null;
  const pending = orders.filter((o) => o.status === "pending").length;

  const cards = [
    { icon: IndianRupee, label: "Net revenue (30 days)", value: formatINR(revenue), note: change === null ? "No earlier data to compare" : `${change >= 0 ? "+" : ""}${change}% vs previous 30 days` },
    { icon: ShoppingBag, label: "Total orders (30 days)", value: String(last30.length), note: `${pending} awaiting confirmation` },
    { icon: TrendingUp, label: "Average order value", value: last30.length ? formatINR(revenue / last30.length) : "—", note: "Cancelled orders excluded" },
    { icon: Package, label: "Live products", value: String(products.filter((p) => p.is_active).length), note: `${products.length} total in catalogue` },
  ];

  return (
    <div className="space-y-10">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border border-border bg-card p-6">
            <card.icon className="size-5 text-primary" />
            <p className="mt-5 text-xs tracking-[0.18em] text-muted-foreground uppercase">{card.label}</p>
            <p className="mt-2 font-display text-3xl">{card.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{card.note}</p>
          </div>
        ))}
      </div>

      <div className="border border-border bg-card">
        <p className="border-b border-border px-6 py-4 text-xs tracking-[0.2em] uppercase">Latest orders</p>
        {orders.slice(0, 8).map((order) => (
          <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4 text-sm last:border-b-0">
            <div>
              <p>{order.order_number}</p>
              <p className="text-xs text-muted-foreground">
                {order.customer_name} · {new Date(order.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
            <span className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{order.status}</span>
            <span>{formatINR(Number(order.total))}</span>
          </div>
        ))}
        {orders.length === 0 ? <p className="px-6 py-10 text-center text-sm text-muted-foreground">No orders yet.</p> : null}
      </div>
    </div>
  );
}
