// src/sections/FeaturedCollection.tsx
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FeaturedItem = {
  id: string;
  title: string;
  price: string; // discounted price
  originalPrice?: string; // original price before discount
  images: string[];
  badge?: string;
};

// Static featured items with paths in public folder
const STATIC_ITEMS: FeaturedItem[] = [
  {
    id: "1",
    title: "Barcelona Black Veins Special Edition 2024",
    price: "$14.99",
    originalPrice: "$20.00",
    images: [
      "/featured-uploads/barcelonablackveins/barcelonablackveins1.png",
      "/featured-uploads/barcelonablackveins/barcelonablackveins2.png",
      "/featured-uploads/barcelonablackveins/barcelonablackveins3.png",
    ],
    badge: "Hot",
  },
  {
    id: "2",
    title: "Barcelona Home 2025/26",
    price: "$14.99",
    originalPrice: "$20.00",
    images: [
      "/featured-uploads/barcelonahome25-26/barcelonahome25-261.png",
      "/featured-uploads/barcelonahome25-26/barcelonahome25-262.png",
      "/featured-uploads/barcelonahome25-26/barcelonahome25-263.png",
      "/featured-uploads/barcelonahome25-26/barcelonahome25-264.png",
    ],
    badge: "Hot",
  },
  {
    id: "3",
    title: "Italy Away Jersey (Chiesa 14)",
    price: "$14.99",
    originalPrice: "$20.00",
    images: [
      "/featured-uploads/italyaway2024/italyaway20241.png",
      "/featured-uploads/italyaway2024/italyaway20242.png",
      "/featured-uploads/italyaway2024/italyaway20243.png",
    ],
    badge: "Pick",
  },
  {
    id: "4",
    title: "Liverpool Third 2024-2025",
    price: "$14.99",
    originalPrice: "$20.00",
    images: [
      "/featured-uploads/liverpoolthird24-25/liverpoolthird24-251.png",
      "/featured-uploads/liverpoolthird24-25/liverpoolthird24-252.png",
      "/featured-uploads/liverpoolthird24-25/liverpoolthird24-253.png",
    ],
    badge: "Hot",
  },
  {
    id: "5",
    title: "PSG Away 2022",
    price: "$14.99",
    originalPrice: "$20.00",
    images: [
      "/featured-uploads/psgaway2022/psgaway20221.png",
      "/featured-uploads/psgaway2022/psgaway20222.png",
      "/featured-uploads/psgaway2022/psgaway20223.png",
    ],
  },
  {
    id: "6",
    title: "Real Madrid Home 2024",
    price: "$14.99",
    originalPrice: "$20.00",
    images: [
      "/featured-uploads/realmadridhome2024/realmadridhome20241.png",
      "/featured-uploads/realmadridhome2024/realmadridhome20242.png",
      "/featured-uploads/realmadridhome2024/realmadridhome20243.png",
    ],
    badge: "Hot",
  },
];

export default function FeaturedCollection() {
  const [items] = useState<FeaturedItem[]>(STATIC_ITEMS);
  const [index, setIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [pageSize, setPageSize] = useState(1);

  const [isCoarsePointer, setIsCoarsePointer] = useState<boolean>(
    () =>
      (typeof window !== "undefined" &&
        window.matchMedia?.("(pointer: coarse)")?.matches) ||
      false
  );

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setIsCoarsePointer(mq.matches);
    mq.addEventListener?.("change", update);
    update();
    return () => mq.removeEventListener?.("change", update);
  }, []);

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

  const maxIndex = useMemo(() => Math.max(0, items.length - pageSize), [items.length, pageSize]);
  const clamp = useCallback((n: number) => Math.min(Math.max(n, 0), maxIndex), [maxIndex]);
  const to = (dir: "prev" | "next") => setIndex((i) => clamp(dir === "next" ? i + 1 : i - 1));

  const progressWidth =
    items.length <= pageSize
      ? "100%"
      : `${(((index + pageSize) / items.length) * 100).toFixed(2)}%`;

  return (
    <section
      id="featured"
      data-observe="featured"
      className="relative w-full py-16 text-white bg-[radial-gradient(120%_110%_at_8%_-10%,rgba(17,24,39,0.93),rgba(0,0,0,0.95))]"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex items-end justify-between pb-6 top-band">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">
              Featured Collections
            </h2>
            <div className="mt-3 h-1.5 w-28 rounded-full bg-gradient-to-r from-white/90 to-white/20" />
          </div>
        </div>

        <div
          ref={wrapRef}
          className="relative overflow-x-auto overflow-y-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur slider-wrap touch-pan-y hide-scrollbar"
          style={{ ["--card-w" as any]: "min(80vw, 360px)", ["--gap" as any]: "1rem" }}
        >
          <div
            ref={trackRef}
            className="flex gap-4 p-4 md:p-5"
            style={{ transform: `translate3d(calc(${-index} * (var(--card-w) + var(--gap))), 0, 0)`, transition: "transform 520ms cubic-bezier(.22,.61,.36,1)" }}
          >
            {items.map((item, i) => (
              <Card key={item.id} item={item} index={i} />
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute left-0 right-0 bottom-0 p-4 md:p-5">
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-white/80 transition-[width] duration-600" style={{ width: progressWidth }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ item, index }: { item: FeaturedItem; index: number }) {
  const [ready, setReady] = useState<boolean[]>(item.images.map((_, i) => i === 0));
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    item.images.forEach(async (src, i) => {
      if (ready[i]) return;
      const img = new Image();
      img.src = src;
      try {
        await img.decode?.();
      } catch {}
      if (!cancelled) setReady((r) => (r[i] ? r : Object.assign([...r], { [i]: true })));
    });
    return () => {
      cancelled = true;
    };
  }, [item.images.join("|")]);

  return (
    <article className="relative shrink-0 w-[80vw] sm:w-[60vw] md:w-[46vw] lg:w-[380px] rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)] group">
      <div className="relative h-64 md:h-80 overflow-hidden bg-black">
        <div ref={trackRef} className="flex h-full overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x">
          {item.images.map((src, i) => (
            <div key={i} className="relative flex-shrink-0 w-full h-full snap-center">
              <img
                src={src}
                alt={`${item.title} ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
                decoding="async"
                draggable={false}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.backgroundColor = "#374151";
                }}
              />
            </div>
          ))}
        </div>
        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-white text-black text-[11px] font-semibold px-2 py-1 shadow">
            {item.badge}
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

     <div className="p-4 flex justify-between items-start">
  <h3 className="font-semibold leading-tight line-clamp-2">{item.title}</h3>

  <div className="flex flex-col items-end">
    {item.originalPrice && (
      <span className="text-sm text-red-400 line-through tracking-wide">
        {item.originalPrice}
      </span>
    )}
    <span className="text-l font-bold text-green-300 tracking-wide">
      {item.price}
    </span>
  </div>
</div>

    </article>
  );
}
