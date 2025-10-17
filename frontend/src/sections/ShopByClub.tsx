// src/sections/ShopByClub.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ---------------- Types ---------------- */
type Team = { name: string; slug: string; logo?: string };
type ShopByClubProps = { teams?: Team[] };

/* ---------------- Defaults (swap to local assets when ready) ---------------- */
const TEAMS_DEFAULT: Team[] = [
  { name: "Real Madrid", slug: "real-madrid", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
  { name: "FC Barcelona", slug: "barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
  { name: "Manchester City", slug: "man-city", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
  { name: "Liverpool", slug: "liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
  { name: "Paris Saint-Germain", slug: "psg", logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
  { name: "Bayern Munich", slug: "bayern", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_München_logo_%282017%29.svg" },
  { name: "Inter", slug: "inter", logo: "https://upload.wikimedia.org/wikipedia/en/0/0b/FC_Internazionale_Milano_2021.svg" },
  { name: "AC Milan", slug: "ac-milan", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
  { name: "Juventus", slug: "juventus", logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg" },
  { name: "Arsenal", slug: "arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
  { name: "Chelsea", slug: "chelsea", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
  { name: "Al Nassr", slug: "al-nassr", logo: "https://upload.wikimedia.org/wikipedia/en/1/15/Al_Nassr_FC_Logo.svg" },
];

/* ---------------- Athletic color accents (cycled) ---------------- */
const ACCENTS: Array<[string, string]> = [
  ["#ff3b3b", "#ffb800"], // red → yellow
  ["#4f46e5", "#22d3ee"], // indigo → cyan
  ["#16a34a", "#a3e635"], // green → lime
  ["#f97316", "#f43f5e"], // orange → rose
  ["#06b6d4", "#3b82f6"], // cyan → blue
];

/* ---------------- Helpers ---------------- */
// Keep only teams that declare a non-empty logo URL
function sanitizeTeams(list: Team[]) {
  return list.filter((t) => typeof t.logo === "string" && t.logo.trim().length > 0);
}

/* ---------------- ClubCard (self-removes if logo fails) ---------------- */
function ClubCard({
  team,
  from,
  to,
  sizePx,
  radiusPx,
}: {
  team: Team;
  from: string;
  to: string;
  sizePx: number;
  radiusPx: number;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;

  return (
    <div
      className={[
        "group relative shrink-0 snap-start",
        "rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur",
        "transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]",
        "hover:bg-white/[0.07] hover:border-white/20",
      ].join(" ")}
      style={{ width: sizePx, borderRadius: radiusPx }}
    >
      {/* Animated athletic rim */}
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

      {/* Logo-only square */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "1 / 1",
          borderRadius: radiusPx,
          background:
            "radial-gradient(110% 85% at 50% 65%, rgba(255,255,255,0.10), rgba(255,255,255,0) 70%), #0a0a0a",
        }}
      >
        {/* subtle athletic highlight */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(-20deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 35%)",
            mixBlendMode: "screen",
          }}
        />

        {/* Centered logo */}
        <div className="absolute inset-0 grid place-items-center p-7">
          <img
            src={team.logo!}
            alt={team.name}
            loading="lazy"
            decoding="async"
            className="max-h-[78%] max-w-[78%] object-contain transition-transform duration-300 group-hover:scale-[1.05]"
            onError={() => setOk(false)}
          />
        </div>

        {/* Single hover CTA (UI only / disabled) */}
        <div
          className={[
            "pointer-events-none absolute inset-0 grid place-items-center",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "bg-gradient-to-t from-black/65 via-black/30 to-transparent",
          ].join(" ")}
        >
          <button
            type="button"
            disabled
            aria-disabled="true"
            className={[
              "pointer-events-auto inline-flex items-center justify-center",
              "rounded-full px-5 py-2.5 text-sm font-semibold",
              "text-black shadow-xl ring-1 ring-black/5 backdrop-blur",
              "cursor-not-allowed",
            ].join(" ")}
            style={{
              background: `linear-gradient(90deg, ${from}, ${to})`,
            }}
            title="(coming soon)"
            onClick={(e) => e.preventDefault()}
          >
            View Club Kits
          </button>
        </div>

        {/* inner ring */}
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
      </div>
    </div>
  );
}

/* ---------------- Edge buttons (used) ---------------- */
function EdgeBtn({
  children, onClick, ariaLabel, hidden,
}: { children: React.ReactNode; onClick: () => void; ariaLabel: string; hidden?: boolean }) {
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
export default function ShopByClub({ teams = TEAMS_DEFAULT }: ShopByClubProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // exact SAME size for every card at all breakpoints
  const CARD = useMemo(() => ({ size: 360, radius: 30 }), []);

  // hide scrollbar (FF/IE) via styles; Tailwind class handles WebKit
  const hideScrollbarStyle: React.CSSProperties = {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  };

  // sanitize incoming teams (no empty logos)
  const cleanTeams = useMemo(() => sanitizeTeams(teams), [teams]);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateEdges();
    const el = trackRef.current;
    if (!el) return;

    // wheel → horizontal
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        el.scrollBy({ left: e.deltaY, behavior: "auto" });
        e.preventDefault();
      }
    };
    const onScroll = () => updateEdges();
    const ro = new ResizeObserver(updateEdges);

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    ro.observe(el);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  // drag-to-scroll (pointer events)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let down = false, startX = 0, startLeft = 0;

    const d = (e: PointerEvent) => {
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
      down = false;
      el.releasePointerCapture(e.pointerId);
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("pointerdown", d);
    el.addEventListener("pointermove", m);
    el.addEventListener("pointerup", u);
    el.addEventListener("pointercancel", u);
    return () => {
      el.removeEventListener("pointerdown", d);
      el.removeEventListener("pointermove", m);
      el.removeEventListener("pointerup", u);
      el.removeEventListener("pointercancel", u);
    };
  }, []);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section
      aria-label="Popular Teams"
      className="relative border-t border-white/10 bg-neutral-950"
    >
      {/* Athletic live background: diagonal speed stripes + soft gradient wash */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.35) 60%, rgba(0,0,0,.65) 100%), \
             repeating-linear-gradient(-24deg, rgba(255,255,255,0.05) 0 10px, rgba(255,255,255,0) 10px 28px)",
          maskImage:
            "radial-gradient(120% 85% at 50% 15%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="relative mt-5">
          {/* gradient edges */}
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-28 z-10 transition-opacity ${
              canPrev ? "opacity-100" : "opacity-0"
            } bg-gradient-to-r from-neutral-950 to-transparent`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-28 z-10 transition-opacity ${
              canNext ? "opacity-100" : "opacity-0"
            } bg-gradient-to-l from-neutral-950 to-transparent`}
          />

          {/* Track */}
          <div
            ref={trackRef}
            tabIndex={0}
            className={[
              "flex gap-6 overflow-x-auto snap-x scroll-px-8 outline-none select-none",
              "cursor-grab",
              "scrollbar-none",
            ].join(" ")}
            style={{ ...hideScrollbarStyle, scrollBehavior: "smooth" }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") scrollByAmount("right");
              if (e.key === "ArrowLeft") scrollByAmount("left");
            }}
          >
            {cleanTeams.map((t, i) => {
              const [from, to] = ACCENTS[i % ACCENTS.length];
              return (
                <ClubCard
                  key={t.slug}
                  team={t}
                  from={from}
                  to={to}
                  sizePx={CARD.size}
                  radiusPx={CARD.radius}
                />
              );
            })}
          </div>

          {/* Side chevrons overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 md:px-3">
            <div className="pointer-events-auto">
              <EdgeBtn hidden={!canPrev} onClick={() => scrollByAmount("left")} ariaLabel="Previous">
                <ChevronLeft size={18} />
              </EdgeBtn>
            </div>
            <div className="pointer-events-auto">
              <EdgeBtn hidden={!canNext} onClick={() => scrollByAmount("right")} ariaLabel="Next">
                <ChevronRight size={18} />
              </EdgeBtn>
            </div>
          </div>
        </div>
      </div>

      {/* WebKit scrollbar hide (fallback if you don't use a plugin) */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}
