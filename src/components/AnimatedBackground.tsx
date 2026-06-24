export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Subtle volt halo, top-left only */}
      <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
      {/* Grid overlay */}
      <div className="absolute inset-0 noise-grid opacity-40" />
      {/* Scanline accent */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
}
