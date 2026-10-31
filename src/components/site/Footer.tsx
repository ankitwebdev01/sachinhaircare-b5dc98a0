import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { settingsQuery } from "@/lib/store";
import { waLink, waMessage } from "@/lib/whatsapp";

export function Footer() {
  const { data: settings } = useQuery(settingsQuery);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-ink text-[color:var(--sand)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">{settings?.salon_name ?? "Sachin Family Salon"}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-75">
            {settings?.tagline ?? "Premium human hair wigs, patches and salon care."}
          </p>
          <div className="mt-6 flex gap-3">
            {settings?.whatsapp ? (
              <a
                href={waLink(settings.whatsapp, waMessage.general(settings.salon_name))}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 p-2.5 transition-colors hover:border-primary"
                aria-label="WhatsApp"
              >
                <MessageCircle className="size-4" />
              </a>
            ) : null}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 p-2.5 transition-colors hover:border-primary"
              aria-label="Instagram"
            >
              <Instagram className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.28em] uppercase opacity-60">Explore</p>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            <Link to="/shop">Shop all</Link>
            <Link to="/about">Our studio</Link>
            <Link to="/branches">Branches</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/blog">Hair care journal</Link>
            <Link to="/contact">Book a trial</Link>
            <Link to="/auth">Owner / customer login</Link>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.28em] uppercase opacity-60">Visit us</p>
          <div className="mt-5 flex flex-col gap-3 text-sm opacity-80">
            <span className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {settings?.address}
            </span>
            {settings?.phone ? (
              <span className="flex gap-2">
                <Phone className="size-4" />
                {settings.phone}
              </span>
            ) : null}
            {settings?.email ? (
              <span className="flex gap-2">
                <Mail className="size-4" />
                {settings.email}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs opacity-55">
        © {year} {settings?.salon_name ?? "Sachin Family Salon"}. All rights reserved.
      </div>
    </footer>
  );
}
