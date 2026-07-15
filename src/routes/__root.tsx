import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AuthProvider } from "@/hooks/useAuth";
import { SettingsProvider } from "@/hooks/useSettings";
import { Toaster } from "@/components/ui/sonner";

import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CartProvider } from "@/hooks/useCart";
import { CartDrawer } from "@/components/CartDrawer";
import { QuickActions } from "@/components/QuickActions";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card max-w-md text-center p-10 rounded-3xl">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the void</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn't exist or has drifted away.
        </p>
        <Link to="/" className="btn-3d inline-block mt-6 gradient-primary text-primary-foreground px-5 py-2 rounded-lg font-medium text-sm">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-card max-w-md text-center p-10 rounded-3xl">
        <h1 className="text-xl font-semibold">Something broke</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-3d gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium"
          >
            Try again
          </button>
          <a href="/" className="glass px-4 py-2 rounded-lg text-sm font-medium">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Meerab Imran — Creative Digital Services" },
      { name: "description", content: "Premium freelance design, development, and content services by Meerab Imran. Web, app, branding, video, and writing." },
      { name: "author", content: "Meerab Imran" },
      { property: "og:title", content: "Meerab Imran — Creative Digital Services" },
      { property: "og:description", content: "Premium freelance design, development, and content services by Meerab Imran. Web, app, branding, video, and writing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Meerab Imran — Creative Digital Services" },
      { name: "twitter:description", content: "Premium freelance design, development, and content services by Meerab Imran. Web, app, branding, video, and writing." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/54408ffa-058b-4204-9d9a-15b6ed7a1216" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/54408ffa-058b-4204-9d9a-15b6ed7a1216" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=JetBrains+Mono:wght@300;400;500&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <ScrollProgress />
            <AnimatedBackground />
            <Navbar />
            <main className="pt-24 min-h-screen">
              <Outlet />
            </main>
            <Footer />
            
            <CartDrawer />
            <CustomCursor />
            <QuickActions />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
