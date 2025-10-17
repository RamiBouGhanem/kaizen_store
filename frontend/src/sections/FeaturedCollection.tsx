// src/sections/FeaturedCollection.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import footballTshirt from "../assets/football-tshirt.jpeg";
import footballShoes from "../assets/football-shoes.jpeg";

type FeaturedItem = {
  id: string;
  title: string;
  price: string;
  images: string[];
  badge?: string;
};

const ITEMS: FeaturedItem[] = [
  {
    id: "1",
    title: "Pro Strike FG Elite",
    price: "$109.99",
    images: [footballTshirt, footballShoes, footballTshirt],
    badge: "Pick",
  },
  {
    id: "2",
    title: "Velocity Knit II",
    price: "$94.50",
    images: [footballTshirt, footballShoes, footballTshirt],
    badge: "New",
  },
  {
    id: "3",
    title: "Sprint Control Pro",
    price: "$119.00",
    images: [footballShoes, footballTshirt],
    badge: "Hot",
  },
  {
    id: "4",
    title: "Matchday Heritage",
    price: "$89.00",
    images: [footballTshirt],
  },
  {
    id: "5",
    title: "Touch+ Traction",
    price: "$99.00",
    images: [footballShoes, footballTshirt, footballShoes, footballTshirt],
  },
  {
    id: "6",
    title: "AeroWeave Top",
    price: "$74.00",
    images: [footballShoes, footballTshirt],
  },
];

export default function FeaturedCollection() {
  const [index, setIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pageSize, setPageSize] = useState(1);

  useEffect(() => {
    const onResize = () => {
      const w = wrapRef.current?.clientWidth ?? 0;
      if (w >= 1200) setPageSize(3);
      else if (w >= 840) setPageSize(2);
      else setPageSize(1);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const maxIndex = useMemo(() => Math.max(0, ITEMS.length - pageSize), [pageSize]);
  const clamp = (n: number) => Math.min(Math.max(n, 0), maxIndex);
  const to = (dir: "prev" | "next") => setIndex((i) => clamp(dir === "next" ? i + 1 : i - 1));

  const trackStyle: React.CSSProperties = {
    transform: `translate3d(calc(${-index} * (var(--card-w) + var(--gap))), 0, 0)`,
    transition: "transform 520ms cubic-bezier(.22,.61,.36,1)",
    willChange: "transform",
  };

  const progressWidth =
    ITEMS.length <= pageSize
      ? "100%"
      : `${(((index + pageSize) / ITEMS.length) * 100).toFixed(2)}%`;

  return (
    <section
      id="featured"
      data-observe="featured"
      className={[
        "relative w-full py-16 text-white",
        "bg-[radial-gradient(120%_110%_at_8%_-10%,rgba(17,24,39,0.93),rgba(0,0,0,0.95))]",
      ].join(" ")}
    >
      <div
        className="absolute inset-x-0 -top-10 h-32 parallax"
        data-speed="0.2"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,0.10), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 grid-fade"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 16%, rgba(0,0,0,1) 84%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 16%, rgba(0,0,0,1) 84%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex items-end justify-between pb-6 top-band" data-stagger="140">
          <div className="reveal" data-animate="fade-up" data-duration="1200ms">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Featured Collections</h2>
            <div className="mt-3 h-1.5 w-28 rounded-full bg-gradient-to-r from-white/90 to-white/20 headline-underline" />
          </div>
          <div className="flex items-center gap-2 controls">
            <NavBtn ariaLabel="Previous" onClick={() => to("prev")} disabled={index === 0}>
              <ChevronLeft size={18} />
            </NavBtn>
            <NavBtn ariaLabel="Next" onClick={() => to("next")} disabled={index === maxIndex}>
              <ChevronRight size={18} />
            </NavBtn>
          </div>
        </div>

        <div
          ref={wrapRef}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur slider-wrap"
          style={{ ["--card-w" as any]: "min(360px, 86vw)", ["--gap" as any]: "1.25rem" }}
        >
          <div className="sweep" />

          <div className="flex gap-5 p-4 md:p-5" style={trackStyle}>
            {ITEMS.map((item, i) => (
              <Card key={item.id} item={item} index={i} />
            ))}
          </div>

          <div className="absolute left-0 right-0 bottom-0 p-4 md:p-5">
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/80 transition-[width] duration-600"
                style={{ width: progressWidth }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const NavBtn = ({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    onClick={onClick}
    disabled={disabled}
    className={[
      "inline-flex h-10 w-10 items-center justify-center rounded-full",
      "bg-white/90 text-black shadow ring-1 ring-black/5",
      "hover:scale-105 hover:shadow-lg active:scale-95 transition-all",
      disabled ? "opacity-40 pointer-events-none" : "",
    ].join(" ")}
  >
    {children}
  </button>
);

/**
 * Card — track-based slider (no blink), viewport splits into N regions (N = item.images.length).
 * Direction is “pan” across a single track; speed is slower and scales with distance.
 */
function Card({ item, index }: { item: FeaturedItem; index: number }) {
  const len = Math.max(1, item.images.length);

  const [active, setActive] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

  // Preload/decoded status to avoid any mid-slide decode jank
  const [ready, setReady] = React.useState<boolean[]>(
    () => item.images.map((_, i) => i === 0)
  );

  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  // Easing & timing (slower, professional)
  const EASING = "cubic-bezier(.4, 0, .2, 1)";
  const BASE_MS_PER_STEP = 520;
  const MIN_MS = 520;
  const MAX_MS = 1400;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pre-decode all images
  useEffect(() => {
    let cancelled = false;
    item.images.forEach(async (src, i) => {
      if (ready[i]) return;
      const img = new Image();
      img.src = src;
      try {
        // @ts-ignore
        await img.decode?.();
      } catch {}
      if (!cancelled) {
        setReady((r) => {
          if (r[i]) return r;
          const cp = [...r];
          cp[i] = true;
          return cp;
        });
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.images.join("|")]);

  // Map pointer to region [0..len-1]
  const regionFromX = (clientX: number, left: number, width: number) => {
    const x = Math.max(0, Math.min(width - 1, clientX - left));
    return Math.floor((x / width) * len);
  };

  const durationFor = (from: number, to: number) => {
    const steps = Math.max(1, Math.abs(to - from));
    const ms = steps * BASE_MS_PER_STEP;
    return Math.max(MIN_MS, Math.min(MAX_MS, ms));
  };

  const slideTo = async (targetIdx: number) => {
    if (animating || len <= 1) return;
    targetIdx = Math.max(0, Math.min(len - 1, targetIdx));
    if (targetIdx === active) return;

    // Ensure target decoded (prevents any blink)
    if (!ready[targetIdx]) {
      const img = new Image();
      img.src = item.images[targetIdx];
      try {
        // @ts-ignore
        await img.decode?.();
      } catch {}
      setReady((r) => {
        if (r[targetIdx]) return r;
        const cp = [...r];
        cp[targetIdx] = true;
        return cp;
      });
    }

    const track = trackRef.current;
    if (!track) return;

    setAnimating(true);

    const ms = prefersReducedMotion ? 0 : durationFor(active, targetIdx);

    track.style.willChange = "transform";
    track.style.transition = ms === 0 ? "none" : `transform ${ms}ms ${EASING}`;
    track.style.transform = `translate3d(${-targetIdx * 100}%, 0, 0)`;

    const onEnd = () => {
      track.removeEventListener("transitionend", onEnd);
      setActive(targetIdx);
      setAnimating(false);
    };

    if (ms === 0) {
      setActive(targetIdx);
      setAnimating(false);
    } else {
      track.addEventListener("transitionend", onEnd, { once: true });
    }
  };

  const onEnter: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    slideTo(regionFromX(e.clientX, rect.left, rect.width));
  };

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const region = regionFromX(e.clientX, rect.left, rect.width);
    if (!animating && region !== active) slideTo(region);
  };

  const onLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    const track = trackRef.current;
    if (track) {
      track.style.transition = "none";
      track.style.transform = `translate3d(0%, 0, 0)`;
      // force reflow so next animated change will take effect
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      track.offsetHeight;
    }
    setActive(0);
    setAnimating(false);
  };

  return (
    <article
      className="relative shrink-0 w-[min(360px,86vw)] md:w-[min(420px,46vw)] lg:w-[380px] rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)] group"
      data-animate={index % 2 ? "fade-up" : "fade-right"}
      data-duration="1200ms"
      style={{ ["--i" as any]: index }}
    >
      <div className="relative">
        {/* VIEWPORT */}
        <div
          ref={viewportRef}
          className="relative h-64 md:h-80 overflow-hidden bg-black"
          onMouseEnter={onEnter}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          {/* TRACK: all images inline; we move the track */}
          <div
            ref={trackRef}
            className="absolute inset-0 flex"
            style={{
              transform: `translate3d(${-active * 100}%, 0, 0)`,
              transition: "none",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          >
            {item.images.map((src, i) => (
              <div key={i} className="relative shrink-0 w-full h-full">
                <img
                  src={src}
                  alt={`${item.title} ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* DOTS */}
          {len > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-20">
              {Array.from({ length: len }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to image ${i + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!animating) slideTo(i);
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    if (!animating) slideTo(i);
                  }}
                  className={
                    "h-2.5 w-2.5 rounded-full ring-1 ring-white/30 transition-all " +
                    (i === active ? "bg-white/90 scale-110" : "bg-white/35 hover:bg-white/60")
                  }
                />
              ))}
            </div>
          )}
        </div>

        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white text-black text-[11px] font-semibold px-2 py-1 shadow">
            {item.badge}
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold leading-tight line-clamp-2">{item.title}</h3>
          <div className="text-sm text-white/80 shrink-0">{item.price}</div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold bg-white text-black shadow transition">
            Quick View
          </button>
          <button className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold bg-white/10 text-white hover:bg-white/15 border border-white/15 transition">
            Add to Cart
          </button>
        </div>
      </div>

      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-white/30 transition duration-200 group-focus:ring-2" />
    </article>
  );
}
