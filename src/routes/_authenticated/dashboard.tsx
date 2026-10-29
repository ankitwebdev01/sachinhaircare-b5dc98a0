import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BarChart3, Clapperboard, Image, LogOut, Package, Palette, Scissors, Settings, ShoppingBag } from "lucide-react";
import { OverviewTab } from "@/components/admin/OverviewTab";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { SlidesTab } from "@/components/admin/SlidesTab";
import { ThemeTab } from "@/components/admin/ThemeTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import { VideosTab } from "@/components/admin/VideosTab";
import { TransformationsTab } from "@/components/admin/TransformationsTab";
import { settingsQuery } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Owner Dashboard — Sachin Family Salon" },
      { name: "description", content: "Manage products, prices, hero advertisements, festive themes and orders." },
      { property: "og:title", content: "Owner Dashboard — Sachin Family Salon" },
      { property: "og:description", content: "Private control panel for the salon owner." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const tabs = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "products", label: "Products", icon: Package },
  { key: "slides", label: "Hero ads", icon: Image },
  { key: "videos", label: "Trending videos", icon: Clapperboard },
  { key: "transforms", label: "Transformations", icon: Scissors },
  { key: "theme", label: "Festive theme", icon: Palette },
  { key: "orders", label: "Orders", icon: ShoppingBag },
  { key: "settings", label: "Salon details", icon: Settings },
] as const;

function Dashboard() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("overview");
  const { data: settings } = useQuery(settingsQuery);
  const navigate = useNavigate();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is_admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
      return Boolean(data);
    },
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  if (isLoading) return <p className="py-32 text-center text-muted-foreground">Loading…</p>;
  if (!isAdmin)
    return (
      <div className="py-32 text-center">
        <p className="font-display text-3xl">This area is for the salon owner only.</p>
        <Link to="/" className="mt-6 inline-block text-primary">Back to the website</Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="font-display text-2xl">{settings?.salon_name ?? "Sachin Family Salon"}</p>
            <p className="text-xs tracking-[0.26em] text-muted-foreground uppercase">Owner dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="border border-border px-5 py-2.5 text-xs tracking-[0.18em] uppercase">
              View website
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-xs tracking-[0.18em] uppercase"
            >
              <LogOut className="size-3.5" /> Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className="inline-flex items-center gap-2 border-b-2 px-4 py-3 text-xs tracking-[0.18em] whitespace-nowrap uppercase"
              style={{
                borderColor: tab === item.key ? "var(--primary)" : "transparent",
                color: tab === item.key ? "var(--foreground)" : "var(--muted-foreground)",
              }}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10">
        {tab === "overview" ? <OverviewTab /> : null}
        {tab === "products" ? <ProductsTab /> : null}
        {tab === "slides" ? <SlidesTab /> : null}
        {tab === "videos" ? <VideosTab /> : null}
        {tab === "transforms" ? <TransformationsTab /> : null}
        {tab === "theme" ? <ThemeTab /> : null}
        {tab === "orders" ? <OrdersTab /> : null}
        {tab === "settings" ? <SettingsTab /> : null}
      </main>
    </div>
  );
}
