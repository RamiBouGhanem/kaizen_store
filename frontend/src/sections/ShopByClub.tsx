// src/sections/ShopByClub.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ---------------- Types ---------------- */
export type Team = {
  name: string;
  slug: string;
  logo?: string;
  /** Exact filter value you want in /shop?team=... */
  teamValue?: string;
  /** Optional badge chip to nudge clicks */
  badge?: "Hot" | "New Drop" | "Trending" | string;
};

type ShopByClubProps = {
  teams?: Team[];
  onSelect?: (team: Team) => void; // optional, fires after navigation
};

/* ---------------- Defaults (your chosen 9, in order) ---------------- */
const TEAMS_DEFAULT: Team[] = [
  {
    name: "Real Madrid",
    slug: "real-madrid",
    teamValue: "Real Madrid",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
    badge: "Hot",
  },
  {
    name: "FC Barcelona",
    slug: "barcelona",
    teamValue: "FC Barcelona",
    logo:
      "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
    badge: "Trending",
  },
  {
    name: "Manchester United",
    slug: "man-united",
    teamValue: "Manchester United",
    logo:
      "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  },
  {
    name: "Bayern Munich",
    slug: "bayern",
    teamValue: "FC Bayern Munich",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg",
  },
  {
    name: "Liverpool",
    slug: "liverpool",
    teamValue: "Liverpool",
    logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  },
  {
    name: "Manchester City",
    slug: "man-city",
    teamValue: "Manchester City",
    logo:
      "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  },
  {
    name: "Paris Saint-Germain",
    slug: "psg",
    teamValue: "Paris Saint-Germain",
    logo:
      "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
    badge: "New Drop",
  },
  {
    name: "Arsenal",
    slug: "arsenal",
    teamValue: "Arsenal",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  },
  {
    name: "AC Milan",
    slug: "ac-milan",
    teamValue: "AC Milan",
    logo:
      "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg",
  },
];

/* ---------------- Colors ---------------- */
const ACCENTS: Array<[string, string]> = [
  ["#ff3b3b", "#ffb800"],
  ["#4f46e5", "#22d3ee"],
  ["#16a34a", "#a3e635"],
  ["#f97316", "#f43f5e"],
  ["#06b6d4", "#3b82f6"],
];

/* ---------------- Helpers ---------------- */
const sanitizeTeams = (list: Team[]) =>
  list.filter((t) => typeof t.logo === "string" && t.logo.trim().length > 0);

/* ---------------- Badge chip ---------------- */
function Badge({ label }: { label?: string }) {
  if (!label) return null;
  return (
    <span className="pointer-events-none absolute left-3 top-3 z-10 select-none rounded-full bg-white text-black px-2 py-0.5 text-[10px] font-extrabold tracking-wide shadow">
      {label}
    </span>
  );
}

/* ---------------- ClubCard (wrapped in <a>) ---------------- */
function ClubCard({
  team,
  from,
  to,
  sizePx,
  radiusPx,
  onSelect,
}: {
  team: Team;
  from: string;
  to: string;
  sizePx: number;
  radiusPx: number;
  onSelect?: (team: Team) => void;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;

  const teamQuery = team.teamValue ?? team.name;
  const href = `/shop?team=${encodeURIComponent(teamQuery)}`;

  return (
    <a
      href={href}
      aria-label={`View ${team.name} products`}
      onClick={() => onSelect?.(team)}
      className={[
        "group relative shrink-0 snap-start",
        "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur",
        "transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]",
        "hover:bg-white/[0.07] hover:border-white/20",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        "cursor-pointer",
      ].join(" ")}
      style={{ width: `${sizePx}px`, borderRadius: `${radiusPx}px` }}
    >
      <Badge label={team.badge} />

      {/* Animated rim (pointer-events: none so it won't block clicks) */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          padding: 2,
          background: `conic-gradient(from 0deg, ${from}, ${to}, ${from})`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "spin 7s linear infinite",
        }}
      />
      <style>{`@keyframes spin{to{transform: rotate(1turn);}}`}</style>

      {/* Logo square */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "1 / 1",
          borderRadius: radiusPx,
          background:
            "radial-gradient(110% 85% at 50% 65%, rgba(255,255,255,0.10), rgba(255,255,255,0) 70%), #0a0a0a",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(-20deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 35%)",
            mixBlendMode: "screen",
          }}
        />
        <div className="absolute inset-0 grid place-items-center p-7">
          <img
            src={team.logo!}
            alt={team.name}
            loading="lazy"
            decoding="async"
            className="max-h-[78%] max-w-[78%] object-contain transition-transform duration-300 group-hover:scale-[1.05]"
            onError={() => setOk(false)}
            draggable={false}
          />
        </div>
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
      </div>
    </a>
  );
}

/* ---------------- “More Clubs” card ---------------- */
function MoreCard({ sizePx, radiusPx }: { sizePx: number; radiusPx: number }) {
  return (
    <a
      href="/shop"
      aria-label="View more clubs"
      className={[
        "group relative shrink-0 snap-start",
        "grid place-items-center",
        "rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur",
        "transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]",
        "hover:bg-white/[0.06] hover:border-white/20",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        "cursor-pointer",
      ].join(" ")}
      style={{ width: `${sizePx}px`, borderRadius: `${radiusPx}px`, aspectRatio: "1 / 1" }}
    >
      <div className="text-center">
        <div className="text-sm font-bold text-white/90">More Clubs</div>
        <div className="mt-1 text-xs text-white/60">Browse all →</div>
      </div>
    </a>
  );
}

/* ---------------- Edge button (desktop only) ---------------- */
function EdgeBtn({
  children,
  onClick,
  ariaLabel,
  hidden,
}: {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
  hidden?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center h-12 w-12 rounded-full",
        "bg-white/90 text-black shadow-lg ring-1 ring-black/5 backdrop-blur",
        "transition-all duration-200 hover:scale-105 hover:shadow-xl hover:ring-black/10 active:scale-95",
        hidden ? "opacity-0 pointer-events-none" : "opacity-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ---------------- Main Section ---------------- */
export default function ShopByClub({
  teams = TEAMS_DEFAULT,
  onSelect,
}: ShopByClubProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // responsive card sizing (container-aware)
  const [cardSize, setCardSize] = useState(300);
  const [cardRadius, setCardRadius] = useState(26);

  const hideScrollbarStyle: React.CSSProperties = {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  };
  const cleanTeams = useMemo(() => sanitizeTeams(teams), [teams]);

  // pointer type (live) — hide buttons on coarse pointers (mobile)
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

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  // wheel→horizontal + edges + (desktop) drag (ignore pointer starting on links)
  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        el.scrollBy({ left: e.deltaY, behavior: "auto" });
        e.preventDefault();
      }
    };
    const onScroll = () => updateEdges();

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });

    let down = false,
      startX = 0,
      startLeft = 0;
    let startedOnLink = false;

    const d = (e: PointerEvent) => {
      if (isCoarsePointer) return;
      const target = e.target as Element | null;
      startedOnLink = !!target?.closest("a");
      if (startedOnLink) return;

      down = true;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.classList.add("cursor-grabbing");
    };
    const m = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = startLeft - (e.clientX - startX);
    };
    const u = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      el.releasePointerCapture(e.pointerId);
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("pointerdown", d);
    el.addEventListener("pointermove", m);
    el.addEventListener("pointerup", u);
    el.addEventListener("pointercancel", u);

    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", d);
      el.removeEventListener("pointermove", m);
      el.removeEventListener("pointerup", u);
      el.removeEventListener("pointercancel", u);
      ro.disconnect();
    };
  }, [isCoarsePointer]);

  // container-aware card size
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      let size = 0;
      if (w < 420) size = Math.max(200, Math.min(260, Math.floor(w * 0.7)));
      else if (w < 640) size = Math.max(220, Math.min(280, Math.floor(w * 0.6)));
      else if (w < 900) size = Math.max(260, Math.min(320, Math.floor(w * 0.42)));
      else if (w < 1200) size = Math.max(300, Math.min(340, Math.floor(w * 0.32)));
      else size = 340;

      setCardSize(size);
      setCardRadius(Math.round(size * 0.08) + 18);
      updateEdges();
    });

    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.round((cardSize + 24) * (el.clientWidth < 640 ? 1.1 : 2));
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section
      aria-label="Popular Teams"
      className="relative border-t border-white/10 bg-neutral-950"
    >
      {/* background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 60%, rgba(0,0,0,.65) 100%), repeating-linear-gradient(-24deg, rgba(255,255,255,0.05) 0 10px, rgba(255,255,255,0) 10px 28px)",
          maskImage:
            "radial-gradient(120% 85% at 50% 15%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16"
        ref={wrapRef}
      >
        <div className="relative mt-2">
          {/* gradient edges */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 transition-opacity ${
              canPrev ? "opacity-100" : "opacity-0"
            } bg-gradient-to-r from-neutral-950 to-transparent`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 transition-opacity ${
              canNext ? "opacity-100" : "opacity-0"
            } bg-gradient-to-l from-neutral-950 to-transparent`}
          />

          {/* Track — snap & swipe/drag */}
          <div
            ref={trackRef}
            tabIndex={0}
            className={[
              "flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-6 sm:scroll-px-8 outline-none select-none",
              "cursor-grab",
              "scrollbar-none",
              "p-1",
            ].join(" ")}
            style={{ ...hideScrollbarStyle, scrollBehavior: "smooth" }}
          >
            {cleanTeams.map((t, i) => {
              const [from, to] = ACCENTS[i % ACCENTS.length];
              return (
                <ClubCard
                  key={t.slug}
                  team={t}
                  from={from}
                  to={to}
                  sizePx={cardSize}
                  radiusPx={Math.max(20, cardRadius)}
                  onSelect={onSelect}
                />
              );
            })}

            {/* "More Clubs" tile */}
            <MoreCard sizePx={cardSize} radiusPx={Math.max(20, cardRadius)} />
          </div>

          {/* Desktop-only chevrons */}
          {!isCoarsePointer && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1 sm:px-2 md:px-3">
              <div className="pointer-events-auto">
                <EdgeBtn
                  hidden={!canPrev}
                  onClick={() => scrollByAmount("left")}
                  ariaLabel="Previous"
                >
                  <ChevronLeft size={18} />
                </EdgeBtn>
              </div>
              <div className="pointer-events-auto">
                <EdgeBtn
                  hidden={!canNext}
                  onClick={() => scrollByAmount("right")}
                  ariaLabel="Next"
                >
                  <ChevronRight size={18} />
                </EdgeBtn>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WebKit scrollbar hide */}
      <style>{`.scrollbar-none::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}
