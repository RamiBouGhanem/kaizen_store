// src/pages/Home.tsx
import React from "react";
import Header from "../components/Header";
import { ChevronRight, Circle } from "lucide-react";

// Rails you already have
import ScrollEffects from "../components/ScrollEffects";
// import ShopByCategory from "../sections/ShopByCategory";
import FeaturedCollection from "../sections/FeaturedCollection";
import OldiesGoldies from "../sections/OldiesGoldies";
import ShopByClub, { type Team as ClubTeam } from "../sections/ShopByClub";

/**
 * AUTO-ASSET LOADER (Vite 5+)
 * Accepts any of: .jpg .jpeg .png .webp .avif
 * Expected basenames in /src/assets:
 *  - arsenal-kit.*
 *  - bayern-kit.*
 *  - real-madrid-kit.*
 *  - mancity-kit.*
 *  - barcelona-kit.*
 */
const assetMap = import.meta.glob("../assets/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function findAsset(basename: string): string | undefined {
  const pattern = new RegExp(`/${basename}\\.(jpg|jpeg|png|webp|avif)$`, "i");
  const hit = Object.entries(assetMap).find(([path]) => pattern.test(path));
  return hit?.[1];
}

type Slide = {
  slug:
    | "arsenal-kit"
    | "bayern-kit"
    | "real-madrid-kit"
    | "mancity-kit"
    | "barcelona-kit";
  name: string;
  image?: string;
  // copy + theming
  overline: string;
  headline: string;
  tagline: string;
  headlineGradient: string; // gradient for headline text
  chipBg: string;
  chipText: string;
  ctaGradient: string; // gradient for CTA
  /** Exact team value to pass as /shop?team=... (falls back to name if omitted) */
  teamValue?: string;
};

const BASE_SLIDES: Omit<Slide, "image">[] = [
  {
    slug: "arsenal-kit",
    name: "Arsenal",
    teamValue: "Arsenal",
    overline: "Arsenal Kit",
    headline: "CHASE THE DUSK",
    tagline: "Blue pace. Sunset swagger.",
    headlineGradient: "from-sky-300 via-sky-400 to-indigo-300",
    chipBg: "bg-indigo-500/25",
    chipText: "text-indigo-100",
    ctaGradient: "from-sky-300 to-indigo-400",
  },
  {
    slug: "bayern-kit",
    name: "FC Bayern",
    teamValue: "FC Bayern Munich",
    overline: "Bayern Kit",
    headline: "RED SETS THE RHYTHM",
    tagline: "Relentless tempo. Trophy intent.",
    headlineGradient: "from-red-500 via-rose-500 to-rose-400",
    chipBg: "bg-red-500/25",
    chipText: "text-rose-100",
    ctaGradient: "from-red-400 to-rose-500",
  },
  {
    slug: "real-madrid-kit",
    name: "Real Madrid",
    teamValue: "Real Madrid",
    overline: "Real Madrid Kit",
    headline: "WHITE. UNDER PRESSURE.",
    tagline: "Precision control. Pure class.",
    headlineGradient: "from-zinc-50 via-amber-100 to-zinc-50",
    chipBg: "bg-zinc-100/30",
    chipText: "text-neutral-900",
    ctaGradient: "from-amber-100 to-zinc-50",
  },
  {
    slug: "mancity-kit",
    name: "Man City",
    teamValue: "Manchester City",
    overline: "City Kit",
    headline: "SKY RULES THE GAME",
    tagline: "Flow. Vision. Precision.",
    headlineGradient: "from-sky-400 via-cyan-400 to-sky-300",
    chipBg: "bg-sky-400/25",
    chipText: "text-cyan-50",
    ctaGradient: "from-sky-300 to-cyan-400",
  },
  {
    slug: "barcelona-kit",
    name: "Barcelona",
    teamValue: "FC Barcelona",
    overline: "Barcelona Kit",
    headline: "PLAY WITH PRIDE",
    tagline: "Blaugrana fire. Control with courage.",
    headlineGradient: "from-indigo-500 via-fuchsia-500 to-rose-500",
    chipBg: "bg-fuchsia-500/25",
    chipText: "text-rose-100",
    ctaGradient: "from-indigo-400 to-rose-500",
  },
];

export default function Home() {
  const api = import.meta.env.VITE_API_URL as string | undefined;

  const SLIDES: Slide[] = React.useMemo(
    () =>
      BASE_SLIDES.map((s) => ({
        ...s,
        image: findAsset(s.slug),
      })),
    []
  );

  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  // Mobile swipe
  const touchStartX = React.useRef<number | null>(null);
  const touchDeltaX = React.useRef(0);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // Auto-advance
  React.useEffect(() => {
    if (paused || reduced || SLIDES.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6500);
    return () => clearInterval(id);
  }, [paused, reduced, SLIDES.length]);

  // Dots keyboard support
  const onDotKey = (i: number, e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIdx(i);
      setPaused(true);
    }
  };

  // Touch swipe handlers
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setPaused(true);
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    const threshold = 50; // px
    if (Math.abs(touchDeltaX.current) > threshold) {
      setIdx((i) =>
        touchDeltaX.current > 0
          ? (i - 1 + SLIDES.length) % SLIDES.length
          : (i + 1) % SLIDES.length
      );
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setPaused(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white antialiased scroll-smooth">
      <ScrollEffects />

      {/* Micro-utilities */}
      <style>{`
        @keyframes rise { from{opacity:0; transform:translateY(16px)} to{opacity:1; transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .fade-rise { animation: rise .55s cubic-bezier(.2,.9,.25,1) forwards }
        .d1{ animation-delay:.05s } .d2{ animation-delay:.12s } .d3{ animation-delay:.2s }
        .tunnel { position:absolute; inset:0; pointer-events:none;
          background:
            radial-gradient(120vmax 120vmax at 50% 45%, rgba(0,0,0,0) 0%, rgba(0,0,0,.08) 38%, rgba(0,0,0,.28) 58%, rgba(0,0,0,.6) 90%),
            radial-gradient(40vmax 40vmax at -10% -10%, rgba(0,0,0,.55), transparent 55%),
            radial-gradient(40vmax 40vmax at 110% -10%, rgba(0,0,0,.55), transparent 55%),
            radial-gradient(40vmax 40vmax at -10% 110%, rgba(0,0,0,.55), transparent 55%),
            radial-gradient(40vmax 40vmax at 110% 110%, rgba(0,0,0,.55), transparent 55%);
        }
        .topbottom-scrim{ position:absolute; inset:0;
          background: linear-gradient(to bottom, rgba(0,0,0,.14), rgba(0,0,0,.46) 42%, rgba(8,10,14,.95)); }
        .cta-anim{ background-size:220% 100%; animation: shimmer 9s ease infinite; }
        @media (prefers-reduced-motion: reduce){
          .fade-rise{ animation:none; opacity:1; transform:none }
          .cta-anim{ animation:none }
        }
      `}</style>

      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-black focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {/* Promo strip */}
      <div className="border-b border-white/10 bg-neutral-900/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center text-xs text-white/80">
          New season drop · Free 7-day exchanges
        </div>
      </div>

      <Header api={api} title="KAIZEN" defaultSearch="" onSearch={() => {}} />

      {/* ===================== FULLSCREEN SLIDER ===================== */}
      <section className="relative isolate border-b border-white/10">
        <div
          className="relative min-h-[calc(100svh-4rem)]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Slides */}
          {SLIDES.map((s, i) => (
            <div
              key={s.slug}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={i !== idx}
            >
              {s.image ? (
                <img
                  src={s.image}
                  alt=""
                  className="h-full w-full object-cover"
                  fetchPriority={i === 0 ? "high" : "auto"}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-900">
                  <span className="text-sm text-white/60">
                    Missing asset: <code>{s.slug}</code>
                  </span>
                </div>
              )}

              {/* Dim edges + scrim */}
              <div className="tunnel" aria-hidden />
              <div className="topbottom-scrim" aria-hidden />
            </div>
          ))}

          {/* Centered content */}
          <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-7xl items-center justify-center px-4 text-center">
            {SLIDES[idx] && (
              <div className="w-full">
                {/* Overline */}
                <span
                  className={[
                    "mx-auto mb-3 inline-flex rounded-full px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] backdrop-blur",
                    SLIDES[idx].chipBg,
                    SLIDES[idx].chipText,
                    "fade-rise d1",
                  ].join(" ")}
                >
                  {SLIDES[idx].overline}
                </span>

                {/* Headline */}
                <h1
                  className={[
                    "mx-auto max-w-[16ch] font-extrabold tracking-tight",
                    "text-[2rem] leading-[1.06] sm:text-[2.5rem] md:text-[3.25rem] lg:text-[4rem]",
                    "bg-gradient-to-r bg-clip-text text-transparent",
                    SLIDES[idx].headlineGradient,
                    "fade-rise d2",
                  ].join(" ")}
                  style={{ backgroundSize: "220% 100%" }}
                >
                  {SLIDES[idx].headline}
                </h1>

                {/* Tagline */}
                <p className="fade-rise d3 mx-auto mt-2 max-w-[50ch] text-[0.95rem] leading-6 text-white/85 sm:text-base">
                  {SLIDES[idx].tagline}
                </p>

                {/* CTA -> /shop?team=... */}
                <div className="fade-rise d3 mt-5 flex items-center justify-center">
                  <a
                    href={`/shop?team=${encodeURIComponent(
                      SLIDES[idx].teamValue ?? SLIDES[idx].name
                    )}`}
                    className={[
                      "cta-anim inline-flex h-10 items-center justify-center rounded-full px-4 sm:px-5",
                      "text-[0.9rem] font-bold text-neutral-900 shadow-[0_18px_40px_-18px_rgba(255,255,255,.55)]",
                      "focus:outline-none focus:ring-2 focus:ring-white/70",
                      "bg-gradient-to-r",
                      SLIDES[idx].ctaGradient,
                    ].join(" ")}
                    aria-label={`Shop ${SLIDES[idx].name} now`}
                  >
                    Shop Now
                    <ChevronRight className="ml-1.5" size={16} />
                  </a>
                </div>

                {/* Dots */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  {SLIDES.map((s, i) => (
                    <button
                      key={s.slug}
                      aria-label={`Go to ${s.name}`}
                      className={`grid h-2.5 w-2.5 place-items-center rounded-full border border-white/30 transition ${
                        i === idx ? "bg-white" : "bg-white/10 hover:bg-white/20"
                      }`}
                      onClick={() => {
                        setIdx(i);
                        setPaused(true);
                      }}
                      onKeyDown={(e) => onDotKey(i, e)}
                    >
                      <Circle className="opacity-0" size={8} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================== RAILS ===================== */}
      <main
        id="main"
        className="[content-visibility:auto] [contain-intrinsic-size:1px_1600px]"
      >
        {/* <section className="scroll-mt-24" aria-labelledby="cat-heading">
          <h2 id="cat-heading" className="sr-only">Shop by category</h2>
          <ShopByCategory />
        </section> */}

        <section
          id="featured"
          className="scroll-mt-24"
          aria-labelledby="featured-heading"
        >
          <FeaturedCollection />
        </section>

        <section
          id="goldies"
          className="scroll-mt-24"
          aria-labelledby="goldies-heading"
        >
          <h2 id="goldies-heading" className="sr-only">
            Classics
          </h2>
          <OldiesGoldies />
        </section>

        <section
          id="clubs"
          className="scroll-mt-24"
          aria-labelledby="clubs-heading"
        >
          <h2 id="clubs-heading" className="sr-only">
            Shop by club
          </h2>
          <ShopByClub
            onSelect={(team: ClubTeam) => {
              const url = new URL(window.location.href);
              url.searchParams.set("club", team.slug);
              window.history.pushState({}, "", url);
              window.dispatchEvent(
                new CustomEvent("kaizen:club-selected", { detail: team })
              );
            }}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <span className="text-lg font-extrabold tracking-[0.16em]">
                KAIZEN
              </span>
              <p className="mt-2 text-sm text-white/70">
                Performance essentials engineered for the full 90.
              </p>
            </div>
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} KAIZEN. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
