import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  image_url: string;
  gallery: string[];
  hair_length: string | null;
  hair_color: string | null;
  stock: number;
  featured: boolean;
  is_active: boolean;
  sort_order: number;
};

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  cta_label: string;
  cta_href: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
};

export type SiteSettings = {
  id: number;
  salon_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  announcement: string;
  announcement_active: boolean;
  theme_name: string;
  theme_primary: string;
  theme_accent: string;
  theme_background: string;
};

export type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
  payment_method: string;
  status: string;
  total: number;
  created_at: string;
};

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Product[];
  },
});

export const allProductsQuery = queryOptions({
  queryKey: ["products", "all"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Product[];
  },
});

export const heroSlidesQuery = queryOptions({
  queryKey: ["hero_slides"],
  queryFn: async (): Promise<HeroSlide[]> => {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as HeroSlide[];
  },
});

export const allHeroSlidesQuery = queryOptions({
  queryKey: ["hero_slides", "all"],
  queryFn: async (): Promise<HeroSlide[]> => {
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as HeroSlide[];
  },
});

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async (): Promise<SiteSettings | null> => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return (data as SiteSettings | null) ?? null;
  },
});

export const ordersQuery = queryOptions({
  queryKey: ["orders"],
  queryFn: async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return (data ?? []) as Order[];
  },
});

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}
