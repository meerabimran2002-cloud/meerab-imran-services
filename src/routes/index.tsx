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
      <section className="relative pt-10 pb-32">
        <div className={`${mono} text-primary mb-8 flex items-center gap-2`}>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          [ status: available_for_work ]
        </div>

        <h1
          className="text-[14vw] md:text-[12vw] font-extrabold leading-[0.85] uppercase tracking-tighter"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.12)", color: "transparent" }}
        >
          Meerab
        </h1>
        <h1 className="text-[14vw] md:text-[12vw] font-extrabold leading-[0.85] uppercase tracking-tighter text-primary -mt-[2vw]">
          Imran
        </h1>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <p className="md:col-span-7 text-xl md:text-2xl leading-snug font-light text-foreground/90 max-w-xl">
            A programmer and web developer from Pakistan, building performance-heavy digital experiences with surgical precision.
          </p>
          <div className={`md:col-span-5 ${mono} flex flex-col items-start md:items-end gap-1`}>
            <span className="text-primary">01 // FULL-STACK DEVELOPER</span>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
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
