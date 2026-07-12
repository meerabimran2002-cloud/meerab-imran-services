import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price_range: string;
  icon: string;
}

interface Ctx {
  cart: CartItem[];
  favorites: string[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  isInCart: (id: string) => boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  currency: "USD" | "PKR";
  setCurrency: (c: "USD" | "PKR") => void;
  pkrRate: number;
}

const CartCtx = createContext<Ctx | undefined>(undefined);
const PKR_RATE = 280;

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [currency, setCurrencyState] = useState<"USD" | "PKR">("USD");

  useEffect(() => {
    try {
      const c = localStorage.getItem("cart");
      const f = localStorage.getItem("favorites");
      const cur = localStorage.getItem("currency") as "USD" | "PKR" | null;
      if (c) setCart(JSON.parse(c));
      if (f) setFavorites(JSON.parse(f));
      if (cur === "USD" || cur === "PKR") setCurrencyState(cur);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("favorites", JSON.stringify(favorites)); }, [favorites]);

  const setCurrency = (c: "USD" | "PKR") => {
    setCurrencyState(c);
    localStorage.setItem("currency", c);
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => prev.find(p => p.id === item.id) ? prev : [...prev, item]);
    setOpen(true);
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(p => p.id !== id));
  const clearCart = () => setCart([]);
  const toggleFavorite = (id: string) =>
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <CartCtx.Provider value={{
      cart, favorites, addToCart, removeFromCart, clearCart,
      toggleFavorite, isFavorite: id => favorites.includes(id),
      isInCart: id => cart.some(c => c.id === id),
      open, setOpen, currency, setCurrency, pkrRate: PKR_RATE,
    }}>
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

// Convert "$500" / "$500-$1500" -> formatted string per currency
export function formatPrice(priceRange: string, currency: "USD" | "PKR", rate: number): string {
  const matches = priceRange.match(/\d[\d,]*/g);
  if (!matches || matches.length === 0) return priceRange;
  const nums = matches.map(m => parseInt(m.replace(/,/g, ""), 10));
  const fmt = (n: number) => {
    if (currency === "USD") return `$${n.toLocaleString("en-US")}`;
    // Round to nearest 500 PKR for cleaner display
    const pkr = Math.round((n * rate) / 500) * 500;
    if (pkr >= 100000) {
      const lac = pkr / 100000;
      return `Rs ${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(2)} Lac`;
    }
    return `Rs ${pkr.toLocaleString("en-PK")}`;
  };
  return nums.map(fmt).join(" – ");
}
