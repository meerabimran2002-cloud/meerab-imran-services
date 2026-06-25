import { useState } from "react";
import { X, Trash2, ShoppingBag, Send } from "lucide-react";
import { useCart, formatPrice } from "@/hooks/useCart";
import { ServiceIcon } from "@/components/ServiceIcon";
import { HireModal } from "@/components/HireModal";

export function CartDrawer() {
  const { cart, removeFromCart, clearCart, open, setOpen, currency, pkrRate } = useCart();
  const [checkout, setCheckout] = useState(false);

  if (!open) return null;

  const serviceLabel = cart.length === 1 ? cart[0].name : `${cart.length} services bundle`;

  return (
    <>
      <div className="fixed inset-0 z-[55] flex justify-end animate-fade-in">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <aside className="relative w-full max-w-sm h-full bg-card/95 backdrop-blur-xl border-l border-border flex flex-col animate-fade-up">
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <h3 className="font-display font-bold">Your bundle ({cart.length})</h3>
            </div>
            <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-primary/10"><X className="h-4 w-4" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-sm text-muted-foreground">
                <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-30" />
                Cart is empty. Add services to bundle them.
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <ServiceIcon name={item.icon} className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{formatPrice(item.price_range, currency, pkrRate)}</div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/20">
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="p-4 border-t border-border/50 space-y-2">
              <button onClick={() => setCheckout(true)} className="btn-3d w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2">
                <Send className="h-4 w-4" /> Request bundle quote
              </button>
              <button onClick={clearCart} className="w-full glass py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground">Clear cart</button>
            </div>
          )}
        </aside>
      </div>
      {checkout && (
        <HireModal
          serviceName={serviceLabel}
          onClose={() => setCheckout(false)}
          onSuccess={clearCart}
        />
      )}
    </>
  );
}
