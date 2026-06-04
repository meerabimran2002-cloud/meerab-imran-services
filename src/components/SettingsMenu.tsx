import { useEffect, useRef, useState } from "react";
import { Palette, Globe, Check } from "lucide-react";
import { useSettings, THEMES, LANGS } from "@/hooks/useSettings";

export function SettingsMenu() {
  const { theme, setTheme, lang, setLang, t } = useSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Settings"
        className="flex h-9 w-9 items-center justify-center rounded-lg glass hover:border-primary/40 transition-colors"
      >
        <Palette className="h-4 w-4 text-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 glass-card rounded-2xl p-4 z-50 animate-fade-up">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
              <Palette className="h-3.5 w-3.5" /> {t("theme")}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {THEMES.map(th => (
                <button
                  key={th.id}
                  onClick={() => setTheme(th.id)}
                  title={th.label}
                  className={`relative h-10 rounded-lg border transition-all ${theme === th.id ? "border-primary scale-105" : "border-border hover:border-primary/40"}`}
                  style={{ background: th.swatch }}
                >
                  {theme === th.id && <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-2">
              <Globe className="h-3.5 w-3.5" /> {t("language")}
            </div>
            <div className="grid grid-cols-1 gap-1">
              {LANGS.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${lang === l.id ? "bg-primary/15 text-foreground" : "hover:bg-primary/5 text-muted-foreground"}`}
                >
                  <span>{l.label}</span>
                  <span className="text-xs opacity-70">{l.native}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
