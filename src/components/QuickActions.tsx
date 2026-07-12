import { useEffect, useState } from "react";
import { ArrowUp, Command, Search, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const commands = [
  { label: "Home", path: "/", hint: "Landing page" },
  { label: "About", path: "/about", hint: "Who I am" },
  { label: "Services", path: "/services", hint: "What I offer" },
  { label: "Portfolio", path: "/portfolio", hint: "Recent work" },
  { label: "Feedback", path: "/feedback", hint: "Testimonials" },
  { label: "Admin", path: "/admin", hint: "Dashboard" },
] as const;

export function QuickActions() {
  const [visible, setVisible] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(v => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.hint.toLowerCase().includes(query.toLowerCase())
  );

  const go = (path: string) => {
    setPaletteOpen(false);
    setQuery("");
    navigate({ to: path });
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        <button
          onClick={() => setPaletteOpen(true)}
          aria-label="Open command palette"
          className="group relative flex h-12 w-12 items-center justify-center rounded-full glass-card border border-primary/30 text-primary hover:scale-110 transition-transform"
        >
          <Command className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 text-[9px] font-mono bg-primary text-primary-foreground px-1 rounded">K</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={`flex h-12 w-12 items-center justify-center rounded-full glass-card border border-primary/30 text-primary hover:scale-110 transition-all duration-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>

      {paletteOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-32 px-4 bg-black/60 backdrop-blur-sm animate-fade-up"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="w-full max-w-lg glass-card rounded-2xl overflow-hidden border border-primary/30"
            style={{ background: "rgba(8,10,14,0.96)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="h-4 w-4 text-primary" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to page or search..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
              <button onClick={() => setPaletteOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">No matches</li>
              ) : filtered.map((c) => (
                <li key={c.path}>
                  <button
                    onClick={() => go(c.path)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm hover:bg-primary/10 transition-colors group"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{c.label}</span>
                      <span className="text-[11px] text-muted-foreground">{c.hint}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary">{c.path}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span>↵ to open</span>
              <span>ESC to close</span>
              <span>⌘K toggle</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
