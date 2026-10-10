import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type CartLine = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  wishlist: Omit<CartLine, "quantity">[];
  signedIn: boolean;
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => boolean;
  toggleWish: (line: Omit<CartLine, "quantity">) => void;
  isWished: (id: string) => boolean;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sfs-cart-v1";
const WISH_KEY = "sfs-wish-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<Omit<CartLine, "quantity">[]>([]);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
      const w = window.localStorage.getItem(WISH_KEY);
      if (w) setWishlist(JSON.parse(w));
    } catch {
      /* ignore */
    }
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch {
      /* ignore */
    }
  }, [lines, wishlist]);

  const requireSignIn = useCallback(() => {
    if (signedIn) return true;
    toast.info("Please sign in to save items to your bag or wishlist");
    navigate({ to: "/auth" });
    return false;
  }, [signedIn, navigate]);

  const add = useCallback(
    (line: Omit<CartLine, "quantity">, quantity = 1) => {
      if (!requireSignIn()) return false;
      setLines((current) => {
        const existing = current.find((l) => l.id === line.id);
        if (existing) return current.map((l) => (l.id === line.id ? { ...l, quantity: l.quantity + quantity } : l));
        return [...current, { ...line, quantity }];
      });
      return true;
    },
    [requireSignIn],
  );

  const toggleWish = useCallback(
    (line: Omit<CartLine, "quantity">) => {
      if (!requireSignIn()) return;
      setWishlist((w) => (w.some((x) => x.id === line.id) ? w.filter((x) => x.id !== line.id) : [...w, line]));
    },
    [requireSignIn],
  );

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0 ? current.filter((l) => l.id !== id) : current.map((l) => (l.id === id ? { ...l, quantity } : l)),
    );
  }, []);
  const remove = useCallback((id: string) => setLines((c) => c.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      wishlist,
      signedIn,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal: lines.reduce((s, l) => s + l.quantity * l.price, 0),
      add,
      toggleWish,
      isWished: (id) => wishlist.some((w) => w.id === id),
      setQuantity,
      remove,
      clear,
    }),
    [lines, wishlist, signedIn, add, toggleWish, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
