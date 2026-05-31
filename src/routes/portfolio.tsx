import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio & Pricing — Meerab Imran" },
      { name: "description", content: "Selected projects across web, design, video, and writing — with transparent pricing." },
      { property: "og:title", content: "Portfolio & Pricing — Meerab Imran" },
      { property: "og:description", content: "Selected work and transparent pricing." },
    ],
  }),
  component: Portfolio,
});

interface Item {
  id: string;
  title: string;
  category: string;
  image_url: string;
  price: string | null;
  description: string | null;
}

const filters = ["All", "Web", "App", "Design", "Video", "Writing"] as const;

function Portfolio() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [active, setActive] = useState<(typeof filters)[number]>("All");

  useEffect(() => {
    supabase.from("portfolio_items").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Item[]) ?? []));
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (active === "All") return items;
    return items.filter((i) => i.category === active);
  }, [items, active]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-primary mb-3 animate-fade-up">Selected work</p>
        <h1 className="font-display text-5xl md:text-6xl font-bold animate-fade-up delay-100">
          Portfolio & <span className="gradient-text">Pricing</span>
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              active === f
                ? "gradient-primary text-primary-foreground glow"
                : "glass hover:bg-primary/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {!items ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No items in this category yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((it, i) => (
            <div
              key={it.id}
              className="glass-card lift-3d rounded-2xl overflow-hidden group animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={it.image_url}
                  alt={it.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">{it.category}</span>
                  {it.price && (
                    <span className="text-xs font-bold gradient-text">{it.price}</span>
                  )}
                </div>
                <h3 className="font-display text-lg font-semibold mb-1">{it.title}</h3>
                {it.description && <p className="text-xs text-muted-foreground line-clamp-2">{it.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
