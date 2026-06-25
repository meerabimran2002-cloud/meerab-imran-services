import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles, ShoppingBag, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { useCart } from "@/hooks/useCart";
import { SettingsMenu } from "@/components/SettingsMenu";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const { isAdmin } = useAuth();
  const { t } = useSettings();
  const { cart, favorites, setOpen: setCartOpen } = useCart();

  const links = [
    { to: "/", label: t("home") },
    { to: "/about", label: t("about") },
    { to: "/services", label: t("services") },
    { to: "/portfolio", label: t("portfolio") },
    { to: "/feedback", label: t("feedback") },
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="glass-card mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-6 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-lg bg-primary blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
          <span className="font-display font-bold text-lg gradient-text">Meerab Imran</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20" />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          {favorites.length > 0 && (
            <Link
              to="/services"
              aria-label="Favorites"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg glass hover:border-primary/40 transition-colors"
            >
              <Heart className="h-4 w-4 text-red-400 fill-current" />
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{favorites.length}</span>
            </Link>
          )}
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg glass hover:border-primary/40 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{cart.length}</span>
            )}
          </button>
          <SettingsMenu />
          <Link
            to="/admin"
            className="text-xs px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            {isAdmin ? t("dashboard") : t("admin")}
          </Link>
          <Link
            to="/services"
            className="btn-3d gradient-primary text-primary-foreground font-medium text-sm px-5 py-2 rounded-lg"
          >
            {t("hire")}
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg glass"
          >
            <ShoppingBag className="h-4 w-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full gradient-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{cart.length}</span>
            )}
          </button>
          <SettingsMenu />
          <button
            className="p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden glass-card mx-4 mt-2 rounded-2xl p-4 animate-fade-up">
          <ul className="flex flex-col gap-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm hover:bg-primary/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/admin" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm hover:bg-primary/10">
                {isAdmin ? t("dashboard") : t("admin")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
