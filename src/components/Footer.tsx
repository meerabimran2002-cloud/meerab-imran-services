import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle, Sparkles } from "lucide-react";

export function Footer() {
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
            <p className="text-sm text-muted-foreground max-w-xs">
              Creative digital services — design, development, and storytelling crafted with precision.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3 text-sm">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/services" className="hover:text-foreground transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link></li>
              <li><Link to="/feedback" className="hover:text-foreground transition-colors">Feedback</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3 text-sm">Get in touch</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="mailto:hello@meerabimran.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                <span>hello@meerabimran.com</span>
              </a>
              <a href="https://wa.me/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} Meerab Imran. All rights reserved.</p>
          <p>Crafted with passion and pixels.</p>
        </div>
      </div>

      {/* Floating contact button */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="btn-3d fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-lg glow"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </footer>
  );
}
