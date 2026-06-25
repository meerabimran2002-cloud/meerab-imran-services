import { useState, type FormEvent } from "react";
import { X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface Props {
  serviceName: string;
  serviceId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function HireModal({ serviceName, serviceId, onClose, onSuccess }: Props) {
  const { currency } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.from("service_orders").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      service_name: serviceName,
      service_id: serviceId ?? null,
      message: form.message || null,
      currency,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setDone(true);
    onSuccess?.();
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md glass-card rounded-3xl p-6 animate-fade-up bg-card/95">
        <button onClick={onClose} className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-primary/10" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        {done ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-3" />
            <h3 className="font-display text-xl font-bold mb-1">Request sent!</h3>
            <p className="text-sm text-muted-foreground">Meerab will get back to you shortly.</p>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest text-primary mb-1">Hire request</p>
            <h3 className="font-display text-xl font-bold mb-4">{serviceName}</h3>
            <form onSubmit={submit} className="space-y-3">
              <input required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full glass rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full glass rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <input placeholder="Phone / WhatsApp (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full glass rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <textarea placeholder="Project details..." rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full glass rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button type="submit" disabled={busy} className="btn-3d w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {busy ? "Sending..." : "Send hire request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
