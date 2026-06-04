import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Lock, LogOut, Plus, Trash2, Pencil, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ServiceIcon } from "@/components/ServiceIcon";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Meerab Imran" },
      { name: "description", content: "Admin portal." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: Admin,
});

interface Service {
  id: string; name: string; description: string; icon: string; price_range: string; sort_order: number;
}
interface PortfolioItem {
  id: string; title: string; category: string; image_url: string; price: string | null; description: string | null;
}
interface FeedbackRow {
  id: string; name: string; email: string; rating: number; message: string; created_at: string;
}

function Admin() {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="glass-card rounded-2xl p-10 animate-pulse h-64" />
      </div>
    );
  }

  if (!user) return <LoginCard signIn={signIn} />;
  if (!isAdmin) return <NotAuthorized email={user.email ?? ""} signOut={signOut} />;
  return <Dashboard onSignOut={signOut} />;
}

function LoginCard({ signIn }: { signIn: (e: string, p: string) => Promise<{ error: string | null }> }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      setBusy(false);
      if (error) toast.error(error);
      else toast.success("Signed in");
      return;
    }
    // signup
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }
    // Try to sign in immediately (auto-confirm is on)
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) {
      setBusy(false);
      return toast.success("Account created. Please sign in.");
    }
    // Claim admin role if no admin exists yet (first user becomes owner)
    const { data: claimed } = await supabase.rpc("claim_admin_if_first");
    setBusy(false);
    if (claimed) toast.success("Welcome! You're the admin owner.");
    else toast.success("Account created.");
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="glass-card rounded-3xl p-10">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl gradient-primary blur-xl opacity-60" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
        </div>
        <h1 className="font-display text-2xl font-bold text-center mb-2">
          {mode === "signin" ? "Admin Portal" : "Create account"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {mode === "signin"
            ? "Sign in to manage your site."
            : "The first account becomes the admin owner."}
        </p>

        <div className="flex gap-2 mb-6 p-1 glass rounded-xl">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                mode === m ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {m === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
            <input
              required type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Password</label>
            <input
              required type="password" value={password} minLength={6}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={busy}
            className="btn-3d w-full gradient-primary text-primary-foreground font-semibold py-3.5 rounded-xl disabled:opacity-60"
          >
            {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}


function NotAuthorized({ email, signOut }: { email: string; signOut: () => void }) {
  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="glass-card rounded-3xl p-10 text-center">
        <Shield className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h1 className="font-display text-xl font-bold mb-2">Not authorized</h1>
        <p className="text-sm text-muted-foreground mb-2">
          Signed in as <span className="text-foreground">{email}</span>
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          This account does not have admin access.
        </p>
        <button onClick={signOut} className="btn-3d glass px-5 py-2 rounded-lg text-sm inline-flex items-center gap-2">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  );
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<"services" | "portfolio" | "feedback">("services");
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary mb-1">Admin</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold">Control center</h1>
        </div>
        <button onClick={onSignOut} className="btn-3d glass px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["services", "portfolio", "feedback"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? "gradient-primary text-primary-foreground" : "glass hover:bg-primary/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "services" && <ServicesAdmin />}
      {tab === "portfolio" && <PortfolioAdmin />}
      {tab === "feedback" && <FeedbackAdmin />}
    </div>
  );
}

/* ----- Services admin ----- */
function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const empty = { name: "", description: "", icon: "Sparkles", price_range: "", sort_order: 0 };
  const [form, setForm] = useState<typeof empty & { id?: string }>(empty);

  const load = () => supabase.from("services").select("*").order("sort_order")
    .then(({ data }) => setItems((data as Service[]) ?? []));
  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (form.id) {
      const { id, ...rest } = form;
      const { error } = await supabase.from("services").update(rest).eq("id", id as string);
      if (error) return toast.error(error.message);
      toast.success("Updated");
    } else {
      const { error } = await supabase.from("services").insert(form);
      if (error) return toast.error(error.message);
      toast.success("Added");
    }
    setForm(empty);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="space-y-3">
        {items.map((s) => (
          <div key={s.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ServiceIcon name={s.icon} className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{s.name}</div>
              <div className="text-xs text-muted-foreground truncate">{s.price_range}</div>
            </div>
            <button onClick={() => setForm(s)} className="p-2 glass rounded-lg hover:bg-primary/10">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => del(s.id)} className="p-2 glass rounded-lg hover:bg-destructive/20">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={save} className="glass-card rounded-2xl p-5 space-y-3 h-fit sticky top-28">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> {form.id ? "Edit service" : "Add service"}
        </h3>
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full glass rounded-lg px-3 py-2 text-sm" />
        <textarea required placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full glass rounded-lg px-3 py-2 text-sm resize-none" />
        <input placeholder="Icon (e.g. Code2)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full glass rounded-lg px-3 py-2 text-sm" />
        <input required placeholder="Price range" value={form.price_range} onChange={(e) => setForm({ ...form, price_range: e.target.value })} className="w-full glass rounded-lg px-3 py-2 text-sm" />
        <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full glass rounded-lg px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <button type="submit" className="btn-3d flex-1 gradient-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium">
            {form.id ? "Update" : "Add"}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm(empty)} className="glass px-3 rounded-lg text-sm">Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}

/* ----- Portfolio admin ----- */
function PortfolioAdmin() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const empty = { title: "", category: "Web", image_url: "", price: "", description: "" };
  const [form, setForm] = useState<typeof empty & { id?: string }>(empty);

  const load = () => supabase.from("portfolio_items").select("*").order("created_at", { ascending: false })
    .then(({ data }) => setItems((data as PortfolioItem[]) ?? []));
  useEffect(() => { load(); }, []);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...form, price: form.price || null, description: form.description || null };
    if (form.id) {
      const { id, ...rest } = payload;
      const { error } = await supabase.from("portfolio_items").update(rest).eq("id", id as string);
      if (error) return toast.error(error.message);
      toast.success("Updated");
    } else {
      const { error } = await supabase.from("portfolio_items").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Added");
    }
    setForm(empty);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("portfolio_items").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.id} className="glass-card rounded-xl overflow-hidden">
            <img src={it.image_url} alt={it.title} loading="lazy" className="w-full h-32 object-cover" />
            <div className="p-3">
              <div className="text-xs text-primary uppercase tracking-wider">{it.category}</div>
              <div className="font-semibold text-sm truncate">{it.title}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setForm({ ...it, price: it.price ?? "", description: it.description ?? "" })} className="flex-1 glass rounded-lg py-1 text-xs">Edit</button>
                <button onClick={() => del(it.id)} className="glass rounded-lg px-2 hover:bg-destructive/20"><Trash2 className="h-3 w-3 text-destructive" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={save} className="glass-card rounded-2xl p-5 space-y-3 h-fit sticky top-28">
        <h3 className="font-display font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> {form.id ? "Edit item" : "Add item"}
        </h3>
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full glass rounded-lg px-3 py-2 text-sm" />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full glass rounded-lg px-3 py-2 text-sm bg-background/40">
          {["Web", "App", "Design", "Video", "Writing"].map((c) => <option key={c} value={c} className="bg-background">{c}</option>)}
        </select>
        <ImageUploader value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
        <input placeholder="Price (e.g. $500)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full glass rounded-lg px-3 py-2 text-sm" />
        <textarea placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full glass rounded-lg px-3 py-2 text-sm resize-none" />
        <div className="flex gap-2">
          <button type="submit" className="btn-3d flex-1 gradient-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium">
            {form.id ? "Update" : "Add"}
          </button>
          {form.id && <button type="button" onClick={() => setForm(empty)} className="glass px-3 rounded-lg text-sm">Cancel</button>}
        </div>
      </form>
    </div>
  );
}

/* ----- Feedback admin ----- */
function FeedbackAdmin() {
  const [items, setItems] = useState<FeedbackRow[]>([]);
  const load = () => supabase.from("feedback").select("*").order("created_at", { ascending: false })
    .then(({ data }) => setItems((data as FeedbackRow[]) ?? []));
  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm("Delete this feedback?")) return;
    await supabase.from("feedback").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.length === 0 && <p className="text-muted-foreground text-sm col-span-full text-center py-8">No feedback yet.</p>}
      {items.map((f) => (
        <div key={f.id} className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-semibold">{f.name}</div>
              <div className="text-xs text-muted-foreground">{f.email}</div>
            </div>
            <button onClick={() => del(f.id)} className="p-2 glass rounded-lg hover:bg-destructive/20">
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </button>
          </div>
          <div className="text-xs text-primary mb-2">{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</div>
          <p className="text-sm text-muted-foreground">{f.message}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-3">
            {new Date(f.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
