import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceIcon } from "@/components/ServiceIcon";

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

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      setServices((data as Service[]) ?? []);
    });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest text-primary mb-3 animate-fade-up">What I offer</p>
        <h1 className="font-display text-5xl md:text-6xl font-bold animate-fade-up delay-100">
          Premium <span className="gradient-text">services</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto animate-fade-up delay-200">
          Twelve specialties. One creative studio. Pick what you need — or bundle for a complete package.
        </p>
      </div>

      {!services ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-56 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <div
              key={s.id}
              className="glass-card lift-3d rounded-2xl p-6 group animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-5 group-hover:gradient-primary group-hover:border-transparent transition-all duration-300">
                <ServiceIcon name={s.icon} className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{s.name}</h3>
              <p className="text-sm text-muted-foreground mb-5 min-h-[40px]">{s.description}</p>
              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Starting at</span>
                <span className="text-sm font-bold gradient-text">{s.price_range}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
