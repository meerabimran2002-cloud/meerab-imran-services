import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeId = "cosmic" | "midnight" | "emerald" | "crimson" | "slate";
export type LangId = "en" | "ur" | "ar" | "de" | "fr";

export const THEMES: { id: ThemeId; label: string; swatch: string }[] = [
  { id: "cosmic", label: "Cosmic Purple", swatch: "linear-gradient(135deg,#8b5cf6,#3b82f6)" },
  { id: "midnight", label: "Midnight Blue", swatch: "linear-gradient(135deg,#1e3a8a,#0ea5e9)" },
  { id: "emerald", label: "Emerald Night", swatch: "linear-gradient(135deg,#10b981,#0d9488)" },
  { id: "crimson", label: "Crimson Dark", swatch: "linear-gradient(135deg,#dc2626,#f59e0b)" },
  { id: "slate", label: "Slate Mono", swatch: "linear-gradient(135deg,#475569,#94a3b8)" },
];

export const LANGS: { id: LangId; label: string; native: string; rtl?: boolean }[] = [
  { id: "en", label: "English", native: "English" },
  { id: "ur", label: "Urdu", native: "اردو", rtl: true },
  { id: "ar", label: "Arabic", native: "العربية", rtl: true },
  { id: "de", label: "German", native: "Deutsch" },
  { id: "fr", label: "French", native: "Français" },
];

type Dict = Record<string, string>;
const DICT: Record<LangId, Dict> = {
  en: { home: "Home", about: "About", services: "Services", portfolio: "Portfolio", feedback: "Feedback", admin: "Admin", dashboard: "Dashboard", hire: "Hire Me", language: "Language", theme: "Theme", explore: "Explore", contact: "Get in touch", tagline: "Creative digital services — design, development, and storytelling crafted with precision." },
  ur: { home: "ہوم", about: "تعارف", services: "خدمات", portfolio: "پورٹ فولیو", feedback: "رائے", admin: "ایڈمن", dashboard: "ڈیش بورڈ", hire: "مجھے ہائر کریں", language: "زبان", theme: "تھیم", explore: "دریافت کریں", contact: "رابطہ کریں", tagline: "تخلیقی ڈیجیٹل خدمات — ڈیزائن، ڈویلپمنٹ اور کہانی سنانے کا فن۔" },
  ar: { home: "الرئيسية", about: "نبذة", services: "الخدمات", portfolio: "الأعمال", feedback: "آراء", admin: "المسؤول", dashboard: "لوحة التحكم", hire: "وظفني", language: "اللغة", theme: "السمة", explore: "استكشف", contact: "تواصل معنا", tagline: "خدمات رقمية إبداعية — تصميم، تطوير، وسرد قصصي بدقة." },
  de: { home: "Start", about: "Über mich", services: "Leistungen", portfolio: "Portfolio", feedback: "Feedback", admin: "Admin", dashboard: "Dashboard", hire: "Anfragen", language: "Sprache", theme: "Design", explore: "Entdecken", contact: "Kontakt", tagline: "Kreative digitale Dienste — Design, Entwicklung und Storytelling mit Präzision." },
  fr: { home: "Accueil", about: "À propos", services: "Services", portfolio: "Portfolio", feedback: "Avis", admin: "Admin", dashboard: "Tableau de bord", hire: "Engagez-moi", language: "Langue", theme: "Thème", explore: "Explorer", contact: "Contactez-moi", tagline: "Services numériques créatifs — design, développement et storytelling avec précision." },
};

interface Ctx {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  lang: LangId;
  setLang: (l: LangId) => void;
  t: (key: string) => string;
}

const SettingsCtx = createContext<Ctx | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("cosmic");
  const [lang, setLangState] = useState<LangId>("en");

  useEffect(() => {
    const t = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) as ThemeId | null;
    const l = (typeof localStorage !== "undefined" && localStorage.getItem("lang")) as LangId | null;
    if (t && THEMES.some(x => x.id === t)) setThemeState(t);
    if (l && LANGS.some(x => x.id === l)) setLangState(l);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const meta = LANGS.find(l => l.id === lang)!;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", meta.rtl ? "rtl" : "ltr");
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = (key: string) => DICT[lang][key] ?? DICT.en[key] ?? key;

  return (
    <SettingsCtx.Provider value={{ theme, setTheme: setThemeState, lang, setLang: setLangState, t }}>
      {children}
    </SettingsCtx.Provider>
  );
}

export function useSettings() {
  const c = useContext(SettingsCtx);
  if (!c) throw new Error("useSettings must be used within SettingsProvider");
  return c;
}
