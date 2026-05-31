import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Zap, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceIcon } from "@/components/ServiceIcon";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meerab Imran — Creative Digital Services" },
      { name: "description", content: "Freelance design, development, and creative content. Web, app, branding, video editing and more." },
    ],
  }),
  component: Home,
});

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  price_range: string;
}

function Home() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").limit(6).then(({ data }) => {
      if (data) setServices(data as Service[]);
    });
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/80 to-background" />

        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs text-muted-foreground mb-6 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Available for new projects</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight animate-fade-up delay-100">
            Creative Digital
            <br />
            <span className="gradient-text">Services by</span>
            <br />
            Meerab Imran
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground animate-fade-up delay-200">
            Design, development, video, and storytelling — crafted at agency quality, delivered with freelance speed.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up delay-300">
            <Link
              to="/feedback"
              className="btn-3d gradient-primary text-primary-foreground font-semibold px-7 py-3.5 rounded-xl inline-flex items-center gap-2"
            >
              Hire Me <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="btn-3d glass-card font-semibold px-7 py-3.5 rounded-xl"
            >
              View Services
            </Link>
          </div>

          {/* stats */}
          <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-up delay-500">
            {[
              { v: "120+", l: "Projects shipped" },
              { v: "4.9★", l: "Avg. client rating" },
              { v: "12", l: "Service categories" },
            ].map((s) => (
              <div key={s.l} className="glass-card rounded-2xl p-5">
                <div className="text-2xl md:text-3xl font-display font-bold gradient-text">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-10 h-3 w-3 rounded-full bg-primary animate-glow-pulse glow" />
        <div className="absolute top-1/2 right-16 h-4 w-4 rounded-full bg-accent animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-1/4 left-1/4 h-2 w-2 rounded-full bg-secondary animate-glow-pulse" style={{ animationDelay: "3s" }} />
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Lightning fast", desc: "Most projects ship in days, not weeks." },
            { icon: Star, title: "Agency quality", desc: "Studio-grade craft at freelance prices." },
            { icon: Sparkles, title: "End-to-end", desc: "Design, build, content — one team." },
          ].map((f) => (
            <div key={f.title} className="glass-card lift-3d rounded-2xl p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary mb-4 glow">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary mb-2">What I do</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">Featured services</h2>
          </div>
          <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <Link
              key={s.id}
              to="/services"
              className="glass-card lift-3d rounded-2xl p-6 group"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-4 group-hover:gradient-primary group-hover:border-transparent transition-all">
                <ServiceIcon name={s.icon} className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{s.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{s.description}</p>
              <div className="text-xs gradient-text font-semibold">{s.price_range}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="glass-card rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-50" style={{ background: "var(--gradient-glow)" }} />
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Have a project in mind?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Let's turn your idea into something the internet can't ignore.
          </p>
          <Link
            to="/feedback"
            className="btn-3d gradient-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl inline-flex items-center gap-2"
          >
            Start a conversation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
