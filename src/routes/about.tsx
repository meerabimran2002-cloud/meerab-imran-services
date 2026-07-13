import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import profile from "@/assets/meerab-dp.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Meerab Imran" },
      { name: "description", content: "Get to know Meerab Imran — the designer, developer, and storyteller behind the work." },
      { property: "og:title", content: "About — Meerab Imran" },
      { property: "og:description", content: "The designer, developer, and storyteller behind the work." },
    ],
  }),
  component: About,
});

const skills = [
  { name: "Web Development", value: 95 },
  { name: "UI / UX Design", value: 90 },
  { name: "Video Editing", value: 85 },
  { name: "Branding", value: 88 },
  { name: "Content Writing", value: 82 },
  { name: "App Development", value: 80 },
];

function About() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest text-primary mb-3 animate-fade-up">About</p>
        <h1 className="font-display text-5xl md:text-6xl font-bold animate-fade-up delay-100">
          Designer. Developer. <span className="gradient-text">Storyteller.</span>
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="relative animate-fade-up">
          <div className="absolute -inset-2 gradient-primary opacity-10 blur-2xl rounded-full" />
          <div className="relative glass-card rounded-3xl p-3">
            <img
              src={profile.url}
              alt="Meerab Imran"
              loading="lazy"
              className="rounded-2xl w-full max-w-sm mx-auto"
            />
          </div>
        </div>

        <div className="animate-fade-up delay-200">
          <h2 className="font-display text-3xl font-bold mb-4">
            Hi, I'm <span className="gradient-text">Meerab Imran</span>
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            I'm a web developer and programmer from <span className="text-foreground">Pakistan</span>, currently
            a college student turning late-night code into real products for clients around the world.
            Freelancing is where I built my craft — and so far every client I've worked with has
            walked away with glowing reviews.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            From clean, responsive websites to full-stack apps and polished brand experiences, I focus
            on writing thoughtful code and shipping work that feels considered. If you have an idea,
            I'd love to help you bring it to life.
          </p>


          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { v: "5+", l: "Years experience" },
              { v: "120+", l: "Happy clients" },
              { v: "12", l: "Specialties" },
            ].map((s) => (
              <div key={s.l} className="glass-card rounded-xl p-4 text-center">
                <div className="text-xl font-display font-bold gradient-text">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-24">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 text-center">
          Skills <span className="gradient-text">snapshot</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {skills.map((s, i) => (
            <div key={s.name} className="glass-card rounded-xl p-5">
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">{s.value}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-primary transition-all duration-1000 ease-out"
                  style={{
                    width: mounted ? `${s.value}%` : "0%",
                    transitionDelay: `${i * 100}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Journey */}
      <div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 text-center">
          The <span className="gradient-text">journey</span>
        </h2>
        <div className="max-w-3xl mx-auto space-y-5">
          {[
            { year: "2020", title: "Started freelancing", desc: "Logo design and small web projects for local businesses." },
            { year: "2022", title: "Expanded into video & branding", desc: "Built full brand kits and edited promotional content for creators." },
            { year: "2024", title: "Full-stack development", desc: "Shipped SaaS landing pages and React apps for startup clients." },
            { year: "2026", title: "Multidisciplinary studio", desc: "Operating across 12 specialties — design, dev, video, writing, and more." },
          ].map((j) => (
            <div key={j.year} className="glass-card lift-3d rounded-2xl p-6 flex gap-6">
              <div className="font-display font-bold text-2xl gradient-text shrink-0 w-20">{j.year}</div>
              <div>
                <h3 className="font-semibold mb-1">{j.title}</h3>
                <p className="text-sm text-muted-foreground">{j.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
