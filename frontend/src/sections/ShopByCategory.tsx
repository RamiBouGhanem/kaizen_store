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
  const playedRef = useRef(false); // tracks current intersection state
  const enterTimer = useRef<number | null>(null);

  // Re-trigger key. Increment on each "enter" so animations replay.
  const [cycle, setCycle] = useState(0);

  // ---- Timing knobs (friendlier defaults)
  const DUR = {
    headerIn: 650,
    headerDelay: 20,
    barIn: 600,
    barDelay: 260,
    ctaDelay: 320,
    cardIn: 720,
    cardStagger: 70,
    hoverTrans: 700,
    shine: 1100,
    pulse: 1800,
    gridDelayAfterHeader: 420, // header -> grid sequence
  };

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (prefersReduced) {
      // No motion: just show instantly. But still allow re-trigger by showing/hiding.
      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((e) => e.isIntersecting);
          setPlayHeader(visible);
          setPlayGrid(visible);
        },
        { rootMargin: "0px 0px -20% 0px", threshold: 0.25 }
      );
      io.observe(node);
      return () => io.disconnect();
    }

    const onEnter = () => {
      // Only do this on actual edge (false -> true)
      if (!playedRef.current) {
        playedRef.current = true;
        setCycle((c) => c + 1); // force remount of animated bits
        setPlayHeader(true);
        // sequence into grid
        enterTimer.current = window.setTimeout(() => setPlayGrid(true), DUR.gridDelayAfterHeader);
      }
    };

    const onExit = () => {
      // Only on edge (true -> false)
      if (playedRef.current) {
        playedRef.current = false;
        if (enterTimer.current) {
          clearTimeout(enterTimer.current);
          enterTimer.current = null;
        }
        // Reset so next enter will replay
        setPlayHeader(false);
        setPlayGrid(false);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible) onEnter();
        else onExit();
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
      className="relative w-full pb-14"
    >
      <style>{`
        /* Friendlier, quicker keyframes with less overshoot */
        @keyframes sbc-fadeUp { 
          0% { opacity:0; transform: translateY(14px); } 
          100% { opacity:1; transform: translateY(0); } 
        }
        @keyframes sbc-slideIn {
          0% { opacity:0; transform: translateY(18px); }
          100% { opacity:1; transform: translateY(0); }
        }
        @keyframes sbc-growBar {
          0% { transform: scaleX(0.4); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes sbc-rise {
          0% { opacity: 0; transform: translateY(18px) scale(.992); visibility: visible; }
          60% { opacity: 1; transform: translateY(0) scale(1.004); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Hover FX trimmed to feel snappy, not flashy */
        @keyframes sbc-shine {
          0% { transform: translateX(-50%); opacity: 0; }
          16% { opacity: .75; }
          100% { transform: translateX(150%); opacity: 0; }
        }
        @keyframes sbc-borderPulse {
          0%,100% { box-shadow: 0 0 0 rgba(255,255,255,0); }
          50% { box-shadow: 0 12px 36px rgba(255,255,255,0.14); }
        }
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
        className="pointer-events-none absolute -z-10 w-[42vw] h-[42vw] rounded-full blur-[64px] opacity-[0.18]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(56,189,248,0.65), rgba(56,189,248,0) 70%)",
          top: "-14vw",
          right: "-10vw",
        }}
      />
      <div
        className="pointer-events-none absolute -z-10 w-[38vw] h-[38vw] rounded-full blur-[64px] opacity-[0.16]"
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

      {/* Header (replays on each enter via key) */}
      <div className="relative max-w-7xl mx-auto px-4">
        <header className="flex items-end justify-between pt-10 pb-5" key={`hdr-${cycle}`}>
          <div
            style={
              playHeader || prefersReduced
                ? undefined
                : { opacity: 0, visibility: "hidden" }
            }
          >
            <div
              className="text-[11px] tracking-[0.28em] text-white/60"
              style={
                playHeader && !prefersReduced
                  ? { animation: `sbc-fadeUp ${DUR.headerIn}ms cubic-bezier(.22,.61,.36,1) both` }
                  : undefined
              }
            >
              EXPLORE
            </div>

            <h2
              className="mt-2 text-2xl md:text-3xl font-extrabold"
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
              className="mt-3 h-1.5 w-28 origin-left rounded-full bg-gradient-to-r from-white/90 to-white/20"
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

      {/* Grid (replays on each enter via key) */}
      <div className="relative max-w-7xl mx-auto px-4">
        <div
          role="list"
          aria-label="Categories"
          tabIndex={0}
          onKeyDown={onKeyGrid}
          className="grid h-[66vh] md:h-[72vh] grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          style={
            playGrid || prefersReduced
              ? undefined
              : { opacity: 0, visibility: "hidden" }
          }
          key={`grid-${cycle}`}
        >
          {CATEGORIES.map((cat, i) => (
            <Card
              key={`${cat.title}-${cycle}`} // remount cards each cycle
              cat={cat}
              id={cardIds[i]}
              delay={playGrid && !prefersReduced ? DUR.cardStagger * i : 0}
              alive={playGrid || prefersReduced}
              hoverDuration={DUR.hoverTrans}
              cardInDuration={DUR.cardIn}
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
}: {
  cat: Category;
  id: string;
  delay: number;
  alive: boolean;
  hoverDuration: number;
  cardInDuration: number;
}) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const ctaRef = useRef<HTMLSpanElement | null>(null);

  // Tilt + parallax + magnetic CTA (gentler)
  useEffect(() => {
    const el = cardRef.current;
    const img = imgRef.current;
    const cta = ctaRef.current;
    if (!el || !img) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;

      // reduced tilt & parallax for comfort
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
  }, []);

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
        "h-[18rem] md:h-auto md:min-h-[calc(72vh-0.5rem)]",
      ].join(" ")}
      style={{
        transform: `perspective(1000px) rotateX(var(--tiltX, 0deg)) rotateY(var(--tiltY, 0deg))`,
        animation: alive ? `sbc-rise ${cardInDuration}ms cubic-bezier(.22,.61,.36,1) both` : "none",
        animationDelay: alive ? `${delay}ms` : "0ms",
      }}
    >
      {/* Image with subtle parallax on hover */}
      <img
        ref={imgRef}
        src={cat.image}
        alt={cat.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: "scale(1.02)", transition: `transform ${hoverDuration}ms cubic-bezier(.22,.61,.36,1)` }}
      />

      {/* Hover shine (LTR) */}
      <div
        aria-hidden
        className="sbc-shine pointer-events-none absolute inset-y-0 left-0 w-[45%] opacity-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.24) 50%, rgba(255,255,255,0) 70%)",
          filter: "blur(5px)",
        }}
      />

      {/* Legibility gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />

      {/* Border glow (animated on hover twice, not infinite) */}
      <div className="sbc-glow pointer-events-none absolute inset-0 rounded-2xl" />

      {/* Badge */}
      {cat.badge ? (
        <span className="absolute left-3 top-3 rounded-full bg-white text-black text-[11px] font-semibold px-2 py-0.5 shadow">
          {cat.badge}
        </span>
      ) : null}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
        <div
          className={[
            "rounded-xl border border-white/10 bg-black/45 backdrop-blur",
            "px-4 py-3 md:px-5 md:py-4",
            "transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/50",
          ].join(" ")}
        >
          <h3 className="text-xl md:text-2xl font-extrabold leading-tight">{cat.title}</h3>
          <p className="mt-1 text-white/80 text-[13px] md:text-sm">{cat.note}</p>

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

      {/* Hover ring */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-white/30 transition duration-200 group-hover:ring-2" />
    </a>
  );
}
