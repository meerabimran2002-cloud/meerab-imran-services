import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeId = "volt" | "cosmic" | "sunrise" | "paper";
export type LangId = "en" | "ur" | "ar" | "de" | "fr";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  swatch: string;
  mode: "dark" | "light";
}

export const THEMES: ThemeMeta[] = [
  { id: "volt", label: "Techno Volt", swatch: "linear-gradient(135deg,#000,#c2ff3d)", mode: "dark" },
  { id: "cosmic", label: "Cosmic Purple", swatch: "linear-gradient(135deg,#8b5cf6,#3b82f6)", mode: "dark" },
  { id: "sunrise", label: "Sunrise Light", swatch: "linear-gradient(135deg,#fff7ed,#fb923c)", mode: "light" },
  { id: "paper", label: "Paper Mono", swatch: "linear-gradient(135deg,#fafafa,#52525b)", mode: "light" },
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
  const [theme, setThemeState] = useState<ThemeId>("volt");
  const [lang, setLangState] = useState<LangId>("en");

  useEffect(() => {
    const t = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) as ThemeId | null;
    const l = (typeof localStorage !== "undefined" && localStorage.getItem("lang")) as LangId | null;
    if (t && THEMES.some(x => x.id === t)) setThemeState(t);
    if (l && LANGS.some(x => x.id === l)) setLangState(l);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const meta = THEMES.find(x => x.id === theme)!;
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-mode", meta.mode);
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
