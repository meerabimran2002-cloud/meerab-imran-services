import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — Meerab Imran" },
      { name: "description", content: "Share your experience working with Meerab Imran, or read what others are saying." },
      { property: "og:title", content: "Feedback — Meerab Imran" },
      { property: "og:description", content: "Share your experience or read recent reviews." },
    ],
  }),
  component: Feedback,
});

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
}

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  rating: z.number().int().min(1).max(5),
  message: z.string().trim().min(1, "Message required").max(2000),
});

function Feedback() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("feedback")
      .select("id, name, rating, message, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) setReviews(data as Review[]);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ ...form, rating });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("feedback").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't submit. Try again.");
      return;
    }
    toast.success("Thanks for the feedback!");
    setForm({ name: "", email: "", message: "" });
    setRating(5);
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-primary mb-3 animate-fade-up">Your voice</p>
        <h1 className="font-display text-5xl md:text-6xl font-bold animate-fade-up delay-100">
          Share <span className="gradient-text">feedback</span>
        </h1>
        <p className="mt-4 text-muted-foreground animate-fade-up delay-200">
          Tell me what worked, what didn't, or just say hi.
        </p>
      </div>

      <form onSubmit={submit} className="glass-card rounded-3xl p-8 md:p-10 mb-16">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full glass rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full glass rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              placeholder="jane@example.com"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="p-1 transition-transform hover:scale-125"
                aria-label={`${n} stars`}
              >
                <Star
                  className={`h-7 w-7 transition-colors ${
                    n <= (hover || rating)
                      ? "fill-primary text-primary drop-shadow-[0_0_8px_oklch(0.70_0.22_295_/_60%)]"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Message</label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full glass rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
            placeholder="Tell me what you think..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-3d mt-6 gradient-primary text-primary-foreground font-semibold px-7 py-3.5 rounded-xl disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Submit feedback"}
        </button>
      </form>

      <h2 className="font-display text-3xl font-bold mb-6 text-center">
        Recent <span className="gradient-text">reviews</span>
      </h2>

      {reviews.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">Be the first to leave feedback.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <div
              key={r.id}
              className="glass-card lift-3d rounded-2xl p-6 animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-display font-semibold">{r.name}</div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3.5 w-3.5 ${idx < r.rating ? "fill-primary text-primary" : "text-muted-foreground/40"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.message}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-3">
                {new Date(r.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
