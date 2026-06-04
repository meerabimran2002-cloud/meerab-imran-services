import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Sparkles, Linkedin } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const EMAIL = "meerab.imran.2002@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/meerab-imran-7aa400361/";

export function Footer() {
  const { t } = useSettings();
  return (
    <footer className="mt-32 border-t border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg gradient-text">Meerab Imran</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">{t("tagline")}</p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3 text-sm">{t("explore")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">{t("about")}</Link></li>
              <li><Link to="/services" className="hover:text-foreground transition-colors">{t("services")}</Link></li>
              <li><Link to="/portfolio" className="hover:text-foreground transition-colors">{t("portfolio")}</Link></li>
              <li><Link to="/feedback" className="hover:text-foreground transition-colors">{t("feedback")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3 text-sm">{t("contact")}</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                <span>{EMAIL}</span>
              </a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating LinkedIn contact button */}
      <a
        href={LINKEDIN}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="btn-3d fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-lg glow"
      >
        <Linkedin className="h-6 w-6" />
      </a>
    </footer>
  );
}
