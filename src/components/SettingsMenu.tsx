import { useEffect, useRef, useState } from "react";
import { Palette, Globe, Check, Moon, Sun, Sparkles } from "lucide-react";
import { useSettings, THEMES, LANGS } from "@/hooks/useSettings";

export function SettingsMenu() {
  const { theme, setTheme, lang, setLang, t } = useSettings();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"theme" | "lang">("theme");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const darkThemes = THEMES.filter(t => t.mode === "dark");
  const lightThemes = THEMES.filter(t => t.mode === "light");

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Settings"
        className="flex h-9 w-9 items-center justify-center rounded-lg glass hover:border-primary/40 transition-colors"
      >
        <Sparkles className="h-4 w-4 text-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl p-1 z-50 animate-fade-up overflow-hidden border border-white/10 shadow-2xl" style={{ background: "rgba(8,10,14,0.98)", backdropFilter: "blur(24px)" }}>
          {/* Unified tab header */}
          <div className="flex gap-1 p-1 m-2 mb-3 rounded-xl bg-background/40">
            <button
              onClick={() => setTab("theme")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                tab === "theme" ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Palette className="h-3.5 w-3.5" /> {t("theme")}
            </button>
            <button
              onClick={() => setTab("lang")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                tab === "lang" ? "gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="h-3.5 w-3.5" /> {t("language")}
            </button>
          </div>

          {tab === "theme" && (
            <div className="px-3 pb-3 max-h-80 overflow-y-auto">
              <ThemeGroup title="Dark themes" icon={<Moon className="h-3 w-3" />} themes={darkThemes} active={theme} onPick={setTheme} />
              <div className="mt-4">
                <ThemeGroup title="Light themes" icon={<Sun className="h-3 w-3" />} themes={lightThemes} active={theme} onPick={setTheme} />
              </div>
            </div>
          )}

          {tab === "lang" && (
            <div className="px-3 pb-3">
              <div className="grid grid-cols-1 gap-1">
                {LANGS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setLang(l.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${lang === l.id ? "bg-primary/15 text-foreground border border-primary/30" : "hover:bg-primary/5 text-muted-foreground border border-transparent"}`}
                  >
                    <span className="flex items-center gap-2">
                      {lang === l.id && <Check className="h-3.5 w-3.5 text-primary" />}
                      {l.label}
                    </span>
                    <span className="text-xs opacity-70 font-mono">{l.native}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ThemeGroup({
  title, icon, themes, active, onPick,
}: { title: string; icon: React.ReactNode; themes: typeof THEMES; active: string; onPick: (id: any) => void }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
        {icon} {title}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {themes.map(th => (
          <button
            key={th.id}
            onClick={() => onPick(th.id)}
            className={`relative flex items-center gap-2 p-2 rounded-lg border transition-all text-xs ${
              active === th.id ? "border-primary scale-[1.02]" : "border-border/40 hover:border-primary/40"
            }`}
          >
            <span className="h-7 w-7 rounded-md shrink-0 border border-white/10" style={{ background: th.swatch }} />
            <span className="text-left flex-1 truncate font-medium">{th.label}</span>
            {active === th.id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
}
