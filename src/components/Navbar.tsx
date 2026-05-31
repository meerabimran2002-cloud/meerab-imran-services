import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/feedback", label: "Feedback" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();
  const { isAdmin } = useAuth();

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
          <Link
            to="/admin"
            className="text-xs px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            {isAdmin ? "Dashboard" : "Admin"}
          </Link>
          <Link
            to="/feedback"
            className="btn-3d gradient-primary text-primary-foreground font-medium text-sm px-5 py-2 rounded-lg"
          >
            Hire Me
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
                {isAdmin ? "Dashboard" : "Admin"}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
