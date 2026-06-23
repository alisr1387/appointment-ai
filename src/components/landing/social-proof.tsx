const logos = [
  "Lumina Skin",
  "Glow Clinic",
  "Aesthetica",
  "PureDerm",
  "Velvet Spa",
  "Radiance MD",
];

export function SocialProof() {
  return (
    <section id="customers" className="section-anchor border-y border-white/5 py-16">
      <div className="section-container">
        <p className="mb-10 text-center text-sm text-slate-500">
          Trusted by modern businesses
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((name) => (
            <div
              key={name}
              className="text-sm font-semibold tracking-wide text-white/25 transition-opacity hover:text-white/40"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
