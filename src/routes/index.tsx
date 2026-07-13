import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meerab Imran — Web Developer & Programmer" },
      { name: "description", content: "Freelance web developer and programmer from Pakistan. Building performance-heavy digital experiences with surgical precision." },
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

const mono = "font-mono text-[11px] uppercase tracking-[0.18em]";

function Home() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").limit(6).then(({ data }) => {
      if (data) setServices(data as Service[]);
    });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6">
      {/* HERO */}
      <section className="relative pt-10 pb-24 md:pb-32">
        <div className={`${mono} text-primary mb-6 md:mb-8 flex items-center gap-2`}>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          [ status: available_for_work ]
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <h1 className="text-[16vw] sm:text-[14vw] lg:text-[10vw] font-extrabold leading-[0.85] uppercase tracking-tighter text-foreground">
              Meerab
            </h1>
            <h1 className="text-[16vw] sm:text-[14vw] lg:text-[10vw] font-extrabold leading-[0.85] uppercase tracking-tighter text-primary -mt-[2vw]">
              Imran
            </h1>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 relative">
            <div className="relative mx-auto max-w-[320px] lg:max-w-none">
              <div className="absolute -inset-4 rounded-3xl bg-primary/30 blur-3xl opacity-70" />
              <div className="absolute -inset-1 rounded-3xl gradient-primary opacity-40 blur-xl" />
              <div className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-2xl">
                <img
                  src={meerabPortrait.url}
                  alt="Meerab Imran"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
              <div className={`absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 ${mono} bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg`}>
                ★ 4.9 / 120+ projects
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 md:mt-14 text-lg md:text-2xl leading-snug font-light text-foreground/90 max-w-2xl">
          A programmer and web developer from Pakistan, building performance-heavy digital experiences with surgical precision.
        </p>

        <div className="mt-8 md:mt-12 flex flex-wrap gap-3">
          <Link
            to="/feedback"
            className="group inline-flex items-center gap-3 bg-primary text-primary-foreground font-bold uppercase tracking-wider text-sm px-6 py-4 hover:bg-foreground transition-colors"
          >
            Hire Me <ArrowUpRight className="h-4 w-4 group-hover:rotate-45 transition-transform" />
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-3 border border-white/15 hover:border-primary text-foreground font-bold uppercase tracking-wider text-sm px-6 py-4 transition-colors"
          >
            View Works
          </Link>
        </div>
      </section>

      {/* MARQUEE STATS */}
      <section className="border-y border-white/10 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { v: "120+", l: "Projects" },
          { v: "4.9★", l: "Avg. Rating" },
          { v: "12", l: "Categories" },
          { v: "24h", l: "Avg. Response" },
        ].map((s) => (
          <div key={s.l}>
            <div className="text-3xl md:text-4xl font-extrabold text-primary">{s.v}</div>
            <div className={`${mono} opacity-60 mt-1`}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section className="py-24">
        <div className="flex justify-between items-baseline mb-10 border-b border-white/10 pb-4">
          <h2 className="text-3xl md:text-5xl font-bold uppercase">Services</h2>
          <span className={`${mono} text-primary`}>/ Capabilities</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 border-l border-t border-white/10">
          {(services.length ? services.slice(0, 6) : Array.from({ length: 3 })).map((s: any, i) => (
            <Link
              to="/services"
              key={s?.id ?? i}
              className="p-10 border-r border-b border-white/10 group hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              <span className={`${mono} mb-8 block`}>
                {String(i + 1).padStart(2, "0")} / {s?.name ? "Service" : "Loading"}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 uppercase">{s?.name ?? "—"}</h3>
              <p className="text-sm leading-relaxed opacity-70 group-hover:opacity-100 line-clamp-3">
                {s?.description ?? "Add services from the admin panel."}
              </p>
              {s?.price_range && (
                <div className={`${mono} mt-6 opacity-80 group-hover:opacity-100`}>{s.price_range}</div>
              )}
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <Link to="/services" className={`${mono} text-primary inline-flex items-center gap-2 hover:gap-3 transition-all`}>
            All services <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* CTA BLOCK */}
      <section className="my-24 bg-primary text-primary-foreground p-12 md:p-20">
        <span className={`${mono} font-bold block mb-8`}>// Let's build something</span>
        <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-[0.95] tracking-tighter max-w-3xl">
          Got a project that needs surgical precision?
        </h2>
        <Link
          to="/feedback"
          className="mt-10 inline-flex items-center gap-3 bg-background text-foreground font-bold uppercase tracking-wider text-sm px-6 py-4 hover:bg-foreground hover:text-background transition-colors"
        >
          Start a conversation <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
