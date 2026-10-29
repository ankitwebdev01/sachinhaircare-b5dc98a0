import { Link } from "@tanstack/react-router";
import { Heart, Home, MessageCircle, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart";
import { settingsQuery } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { waLink, waMessage } from "@/lib/whatsapp";

/** Mobile bottom navigation bar, hidden on md and up. */
export function MobileNav() {
  const { count } = useCart();
  const { data: settings } = useQuery(settingsQuery);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-3 bottom-3 z-50 md:hidden"
    >
      <div className="grid grid-cols-5 items-center rounded-full bg-accent px-2 py-2 shadow-2xl shadow-black/30">
        <Link to="/" aria-label="Home" className="flex flex-col items-center gap-0.5 text-accent-foreground [&.active]:text-primary-foreground">
          <Home className="size-5" />
          <span className="text-[0.55rem] tracking-wide">Home</span>
        </Link>
        <Link to="/wishlist" aria-label="Wishlist" className="flex flex-col items-center gap-0.5 text-accent-foreground">
          <span className="relative">
            <Heart className="size-5" />
          </span>
          <span className="text-[0.55rem] tracking-wide">Wishlist</span>
        </Link>
        <a
          href={waLink(settings?.whatsapp, waMessage.booking(settings?.salon_name))}
          target="_blank"
          rel="noreferrer"
          aria-label="Book on WhatsApp"
          className="-mt-7 flex size-16 flex-col items-center justify-center rounded-full border-4 border-background bg-accent text-accent-foreground shadow-lg"
        >
          <MessageCircle className="size-6" />
          <span className="text-[0.55rem] tracking-wide">Book</span>
        </a>
        <Link to="/cart" aria-label="Cart" className="relative flex flex-col items-center gap-0.5 text-accent-foreground">
          <span className="relative">
            <ShoppingBag className="size-5" />
            {count > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[0.6rem] text-primary-foreground">
                {count}
              </span>
            ) : null}
          </span>
          <span className="text-[0.55rem] tracking-wide">Bag</span>
        </Link>
        <Link to="/auth" aria-label="Account" className="flex flex-col items-center gap-0.5 text-accent-foreground">
          <User className="size-5" />
          <span className="text-[0.55rem] tracking-wide">Account</span>
        </Link>
      </div>
    </nav>
  );
}
