import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Send, Check, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceIcon } from "@/components/ServiceIcon";
import { useCart, formatPrice } from "@/hooks/useCart";
import { HireModal } from "@/components/HireModal";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Meerab Imran" },
      { name: "description", content: "Web & app development, design, video editing, content writing, and branding services." },
      { property: "og:title", content: "Services — Meerab Imran" },
      { property: "og:description", content: "Full-spectrum digital services from a single creative studio." },
    ],
  }),
  component: Services,
});

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  price_range: string;
}

function Services() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [hireFor, setHireFor] = useState<Service | null>(null);
  const { addToCart, isInCart, toggleFavorite, isFavorite, currency, setCurrency, pkrRate } = useCart();

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      setServices((data as Service[]) ?? []);
    });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-primary mb-3 animate-fade-up">What I offer</p>
        <h1 className="font-display text-5xl md:text-6xl font-bold animate-fade-up delay-100">
          Premium <span className="gradient-text">services</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto animate-fade-up delay-200">
          Twelve specialties. One creative studio. Pick what you need — or bundle for a complete package.
        </p>
      </div>

      {/* Currency toggle */}
      <div className="flex justify-center mb-10 animate-fade-up delay-300">
        <div className="glass rounded-full p-1 flex items-center gap-1">
          <DollarSign className="h-3.5 w-3.5 mx-2 text-muted-foreground" />
          {(["USD", "PKR"] as const).map(c => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-4 py-1.5 text-xs font-mono uppercase rounded-full transition-all ${
                currency === c ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {!services ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-72 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const inCart = isInCart(s.id);
            const fav = isFavorite(s.id);
            return (
              <div
                key={s.id}
                className="glass-card lift-3d rounded-2xl p-6 group animate-fade-up relative"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* Favorite */}
                <button
                  onClick={() => toggleFavorite(s.id)}
                  aria-label="Favorite"
                  className={`absolute top-4 right-4 p-2 rounded-full glass hover:scale-110 transition-transform ${fav ? "text-red-400" : "text-muted-foreground"}`}
                >
                  <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
                </button>

                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-5 group-hover:gradient-primary group-hover:border-transparent transition-all duration-300">
                  <ServiceIcon name={s.icon} className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground mb-5 min-h-[40px]">{s.description}</p>

                <div className="pt-4 border-t border-border/50 flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Starting at</span>
                  <span className="text-sm font-bold gradient-text">{formatPrice(s.price_range, currency, pkrRate)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart({ id: s.id, name: s.name, price_range: s.price_range, icon: s.icon })}
                    disabled={inCart}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      inCart ? "glass text-primary" : "glass hover:bg-primary/10"
                    }`}
                  >
                    {inCart ? <><Check className="h-3.5 w-3.5" /> Added</> : <><ShoppingCart className="h-3.5 w-3.5" /> Add</>}
                  </button>
                  <button
                    onClick={() => setHireFor(s)}
                    className="btn-3d flex-1 flex items-center justify-center gap-1.5 gradient-primary text-primary-foreground py-2 rounded-lg text-xs font-semibold"
                  >
                    <Send className="h-3.5 w-3.5" /> Hire
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hireFor && (
        <HireModal
          serviceName={hireFor.name}
          serviceId={hireFor.id}
          onClose={() => setHireFor(null)}
        />
      )}
    </div>
  );
}
