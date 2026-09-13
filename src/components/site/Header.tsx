import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { settingsQuery } from "@/lib/store";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { data: settings } = useQuery(settingsQuery);
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      {settings?.announcement_active && settings.announcement ? (
        <div className="overflow-hidden bg-ink py-2 text-xs tracking-[0.22em] text-primary-foreground uppercase">
          <div className="marquee-track flex w-max gap-16 whitespace-nowrap">
            {[0, 1].map((k) => (
              <span key={k} className="flex gap-16">
                <span>{settings.announcement}</span>
                <span>{settings.announcement}</span>
                <span>{settings.announcement}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
        <Link to="/" className="flex flex-col leading-none">
          <span className="font-display text-2xl font-semibold tracking-tight">
            {settings?.salon_name ?? "Sachin Unisex Salon"}
          </span>
          <span className="mt-1 text-[0.6rem] tracking-[0.34em] text-muted-foreground uppercase">
            Hair Studio &amp; Wig House
          </span>
        </Link>

        <nav className="hidden items-center gap-9 text-sm tracking-[0.12em] uppercase md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {settings?.phone ? (
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:flex"
            >
              <Phone className="size-4" />
              {settings.phone}
            </a>
          ) : null}
          <Link to="/cart" className="relative rounded-full border border-border p-2.5 transition-colors hover:border-primary">
            <ShoppingBag className="size-4" />
            {count > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-[0.65rem] text-accent-foreground">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            className="rounded-full border border-border p-2.5 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-background px-5 py-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-sm tracking-[0.14em] uppercase"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
