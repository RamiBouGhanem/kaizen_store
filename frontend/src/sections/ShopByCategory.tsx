// src/sections/ShopByCategory.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";

type Category = {
  title: string;
  note: string;
  image: string;
  href: string;
  badge?: string;
};

const CATEGORIES: Category[] = [
  {
    title: "Men",
    note: "Performance essentials for every movement",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&auto=format&fit=crop&w=1600",
    href: "#featured",
    badge: "Core",
  },
  {
    title: "Women",
    note: "Engineered for endurance and comfort",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&auto=format&fit=crop&w=1600",
    href: "#goldies",
    badge: "New",
  },
  {
    title: "Training",
    note: "Strength · Conditioning · Mobility",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&auto=format&fit=crop&w=1600",
    href: "#goldies",
    badge: "Pro",
  },
];

export default function ShopByCategory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [playHeader, setPlayHeader] = useState(false);
  const [playGrid, setPlayGrid] = useState(false);
  const playedRef = useRef(false);
  const enterTimer = useRef<number | null>(null);
  const [cycle, setCycle] = useState(0);

  // Motion prefs
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Touch/pen devices (disable tilt/parallax there)
  const isCoarsePointer =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches;

  // ---- Timing knobs
const DUR = {
  headerIn: 260,
  headerDelay: 0,
  barIn: 240,
  barDelay: 60,
  ctaDelay: 80,
  cardIn: 360,
  cardStagger: 28,
  hoverTrans: 240,
  gridDelayAfterHeader: 120,
} as const;



  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (prefersReduced) {
          setPlayHeader(visible);
          setPlayGrid(visible);
          return;
        }
        if (visible && !playedRef.current) {
          playedRef.current = true;
          setCycle((c) => c + 1);
          setPlayHeader(true);
          enterTimer.current = window.setTimeout(
            () => setPlayGrid(true),
            DUR.gridDelayAfterHeader
          );
        } else if (!visible && playedRef.current) {
          playedRef.current = false;
          if (enterTimer.current) {
            clearTimeout(enterTimer.current);
            enterTimer.current = null;
          }
          setPlayHeader(false);
          setPlayGrid(false);
        }
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0.25 }
    );

    io.observe(node);
    return () => {
      io.disconnect();
      if (enterTimer.current) clearTimeout(enterTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardIds = useMemo(
    () => CATEGORIES.map((c) => `cat-${c.title.toLowerCase().replace(/\s+/g, "-")}`),
    []
  );

  const onKeyGrid = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const i = cardIds.findIndex((id) => document.activeElement?.id === id);
    if (i < 0) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      document.getElementById(cardIds[(i + 1) % cardIds.length])?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      document.getElementById(cardIds[(i - 1 + cardIds.length) % cardIds.length])?.focus();
    }
  };

  return (
    <section
      id="shop-by-category"
      ref={sectionRef}
      aria-label="Shop by Category"
      className="relative w-full pb-12 sm:pb-14"
    >
      <style>{`
        @keyframes sbc-fadeUp { 0% { opacity:0; transform: translateY(14px); } 100% { opacity:1; transform: translateY(0); } }
        @keyframes sbc-slideIn { 0% { opacity:0; transform: translateY(18px); } 100% { opacity:1; transform: translateY(0); } }
        @keyframes sbc-growBar { 0% { transform: scaleX(0.4); opacity: 0; } 100% { transform: scaleX(1); opacity: 1; } }
        @keyframes sbc-rise { 0% { opacity: 0; transform: translateY(18px) scale(.992); visibility: visible; }
                              60% { opacity: 1; transform: translateY(0) scale(1.004); }
                              100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes sbc-shine { 0% { transform: translateX(-50%); opacity: 0; }
                               16% { opacity: .75; }
                               100% { transform: translateX(150%); opacity: 0; } }
      `}</style>

      {/* Athletic backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(140%_120%_at_60%_-10%,#0b1324_0%,#0b1324_30%,#070b14_55%,#05070d_70%,#03060b_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          background:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 1px, transparent 1px, transparent 18px)",
        }}
      />
      <div
        className="pointer-events-none absolute -z-10 w-[42vw] h-[42vw] rounded-full blur-[64px] opacity-[0.18] hidden md:block"
        style={{
          background:
            "radial-gradient(closest-side, rgba(56,189,248,0.65), rgba(56,189,248,0) 70%)",
          top: "-14vw",
          right: "-10vw",
        }}
      />
      <div
        className="pointer-events-none absolute -z-10 w-[38vw] h-[38vw] rounded-full blur-[64px] opacity-[0.16] hidden md:block"
        style={{
          background:
            "radial-gradient(closest-side, rgba(163,230,53,0.55), rgba(163,230,53,0) 70%)",
          bottom: "-12vw",
          left: "-8vw",
        }}
      />
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="w-full h-full opacity-[0.06] bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      {/* Header */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex items-end justify-between pt-8 sm:pt-10 pb-4 sm:pb-5" key={`hdr-${cycle}`}>
          <div
            style={playHeader || prefersReduced ? undefined : { opacity: 0, visibility: "hidden" }}
          >
            <div
              className="text-[10px] sm:text-[11px] tracking-[0.28em] text-white/60"
              style={
                playHeader && !prefersReduced
                  ? { animation: `sbc-fadeUp ${DUR.headerIn}ms cubic-bezier(.22,.61,.36,1) both` }
                  : undefined
              }
            >
              EXPLORE
            </div>

            <h2
              className="mt-2 text-xl sm:text-2xl md:text-3xl font-extrabold"
              style={
                playHeader && !prefersReduced
                  ? {
                      animation: `sbc-slideIn ${DUR.headerIn}ms cubic-bezier(.22,.61,.36,1) both`,
                      animationDelay: `${DUR.headerDelay}ms`,
                    }
                  : undefined
              }
            >
              Shop by Category
            </h2>

            <div
              aria-hidden
              className="mt-3 h-1.5 w-24 sm:w-28 origin-left rounded-full bg-gradient-to-r from-white/90 to-white/20"
              style={
                playHeader && !prefersReduced
                  ? {
                      animation: `sbc-growBar ${DUR.barIn}ms cubic-bezier(.22,.61,.36,1) both`,
                      animationDelay: `${DUR.barDelay}ms`,
                    }
                  : undefined
              }
            />
          </div>

          <a
            href="#featured"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition"
            style={
              playHeader
                ? {
                    animation: prefersReduced
                      ? undefined
                      : `sbc-fadeUp ${DUR.headerIn}ms cubic-bezier(.22,.61,.36,1) both`,
                    animationDelay: prefersReduced ? undefined : `${DUR.ctaDelay}ms`,
                  }
                : { opacity: 0, visibility: "hidden" }
            }
          >
            See Featured <ChevronRight size={16} />
          </a>
        </header>
      </div>

      {/* Grid */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          role="list"
          aria-label="Categories"
          tabIndex={0}
          onKeyDown={onKeyGrid}
          className={[
            "grid gap-4 md:gap-6",
            // 1 col on mobile, 2 on small tablets, 3 on md+
            "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
          ].join(" ")}
          style={playGrid || prefersReduced ? undefined : { opacity: 0, visibility: "hidden" }}
          key={`grid-${cycle}`}
        >
          {CATEGORIES.map((cat, i) => (
            <Card
              key={`${cat.title}-${cycle}`}
              cat={cat}
              id={cardIds[i]}
              delay={playGrid && !prefersReduced ? DUR.cardStagger * i : 0}
              alive={playGrid || prefersReduced}
              hoverDuration={DUR.hoverTrans}
              cardInDuration={DUR.cardIn}
              isCoarsePointer={isCoarsePointer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Card ----------------------- */

function Card({
  cat,
  id,
  delay,
  alive,
  hoverDuration,
  cardInDuration,
  isCoarsePointer,
}: {
  cat: Category;
  id: string;
  delay: number;
  alive: boolean;
  hoverDuration: number;
  cardInDuration: number;
  isCoarsePointer: boolean;
}) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const ctaRef = useRef<HTMLSpanElement | null>(null);

  // Tilt/parallax only for precise pointers (mouse), not on touch
  useEffect(() => {
    if (isCoarsePointer) return;

    const el = cardRef.current;
    const img = imgRef.current;
    const cta = ctaRef.current;
    if (!el || !img) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      el.style.setProperty("--tiltX", `${(y * -4.5).toFixed(2)}deg`);
      el.style.setProperty("--tiltY", `${(x * 6).toFixed(2)}deg`);
      img.style.transform = `translate3d(${(x * 8).toFixed(1)}px, ${(y * 6).toFixed(1)}px, 0) scale(1.035)`;
      if (cta) cta.style.transform = `translate3d(${(x * 4).toFixed(1)}px, ${(y * 3).toFixed(1)}px, 0)`;
    };
    const onLeave = () => {
      el.style.setProperty("--tiltX", `0deg`);
      el.style.setProperty("--tiltY", `0deg`);
      img.style.transform = "translate3d(0,0,0) scale(1.02)";
      if (cta) cta.style.transform = "translate3d(0,0,0)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [isCoarsePointer]);

  return (
    <a
      id={id}
      ref={cardRef}
      href={cat.href}
      role="listitem"
      className={[
        "sbc-card group relative isolate overflow-hidden rounded-2xl",
        "border border-white/12 bg-white/[0.04] backdrop-blur-sm",
        "shadow-[0_10px_32px_rgba(0,0,0,0.35)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        "transition-all",
        // Responsive heights:
        // - Mobile: fixed aspect for consistency
        // - sm: taller cards
        // - md+: your original tall layout via min-height
        "aspect-[4/5] sm:aspect-[3/4] md:aspect-auto",
        "md:min-h-[28rem] lg:min-h-[calc(72vh-0.5rem)]",
      ].join(" ")}
      style={{
        transform: `perspective(1000px) rotateX(var(--tiltX, 0deg)) rotateY(var(--tiltY, 0deg))`,
        animation: alive ? `sbc-rise ${cardInDuration}ms cubic-bezier(.22,.61,.36,1) both` : "none",
        animationDelay: alive ? `${delay}ms` : "0ms",
      }}
    >
      {/* Image */}
      <img
        ref={imgRef}
        src={cat.image}
        alt={cat.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          transform: "scale(1.02)",
          transition: `transform ${hoverDuration}ms cubic-bezier(.22,.61,.36,1)`,
        }}
      />

      {/* Shine — only visible on hover-capable devices */}
      <div
        aria-hidden
        className={[
          "sbc-shine pointer-events-none absolute inset-y-0 left-0 w-[45%] opacity-0",
          isCoarsePointer ? "hidden" : "block",
        ].join(" ")}
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.24) 50%, rgba(255,255,255,0) 70%)",
          filter: "blur(5px)",
        }}
      />

      {/* Legibility gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />

      {/* Badge */}
      {cat.badge ? (
        <span className="absolute left-3 top-3 rounded-full bg-white text-black text-[11px] font-semibold px-2 py-0.5 shadow">
          {cat.badge}
        </span>
      ) : null}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5">
        <div
          className={[
            "rounded-xl border border-white/10 bg-black/45 backdrop-blur",
            "px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4",
            "transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50",
          ].join(" ")}
        >
          <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight">
            {cat.title}
          </h3>
          <p className="mt-1 text-white/80 text-[12px] sm:text-[13px] md:text-sm">
            {cat.note}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-[11px] text-white/60">Explore {cat.title}</span>
            <span
              ref={ctaRef}
              className={[
                "inline-flex items-center gap-2 rounded-full bg-white text-black px-3 py-1.5 text-xs font-semibold",
                "transition-transform duration-200 group-hover:gap-3 group-hover:scale-[1.05]",
                "shadow-sm",
              ].join(" ")}
            >
              Shop Now <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>

      {/* Hover ring (kept subtle on touch) */}
      <span
        className={[
          "pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-white/30 transition duration-200",
          isCoarsePointer ? "" : "group-hover:ring-2",
        ].join(" ")}
      />
    </a>
  );
}
