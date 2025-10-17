import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/Header";
import { Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { ChevronRight, ChevronLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";

import OldiesGoldies from "../sections/OldiesGoldies";
import FeaturedCollection from "../sections/FeaturedCollection";
import ScrollEffects from "../components/ScrollEffects";
import ShopByCategory from "../sections/ShopByCategory";
import ShopByClub, { type Team as ClubTeam } from "../sections/ShopByClub"; // ← type-only import

// Background + hero playlist assets
import bg from "../assets/pexels-eslames1-31160056.jpg";
import heroVideo1 from "../assets/homePageVideo1.mp4";
import heroVideo2 from "../assets/homePageVideo2.mp4";
import heroVideo3 from "../assets/homePageVideo3.mp4";
import kaizenLogo from "../assets/kaizen-logo.png";

const HERO_VIDEOS: string[] = [heroVideo1, heroVideo2, heroVideo3];

export default function Home() {
  const api = import.meta.env.VITE_API_URL as string | undefined;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <ScrollEffects />
      <Header api={api} title="KAIZEN" cartCount={0} defaultSearch="" onSearch={() => {}} />

      {/* ===================== HERO ===================== */}
      <section className="relative border-b border-white/10">
        <div
          className="relative"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            minHeight: "calc(100vh - 4rem)",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_80%_0%,rgba(0,0,0,0.12),rgba(0,0,0,0.8))]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/40 to-black/80" />

          <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-16">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Copy */}
              <div className="lg:col-span-6">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05]">
                  You don’t stop{" "}
                  <span className="inline-block align-baseline relative">
                    Neither do we
                    <span
                      aria-hidden
                      className="absolute -bottom-2 left-0 right-0 h-[6px] rounded-full bg-gradient-to-r from-white/70 to-white/10"
                    />
                  </span>
                  .
                </h1>

                <p className="mt-4 max-w-prose text-lg md:text-xl leading-relaxed text-white/85">
                  What drives you drives us — because greatness starts the moment you choose to
                  continue. We build to honor your discipline.
                </p>

                <div className="mt-6">
                  <a
                    href="#featured"
                    className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-5 py-2.5 text-sm font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    Start your season <ChevronRight size={16} />
                  </a>
                </div>

                <div className="mt-7 grid grid-cols-3 gap-3 max-w-md">
                  <TrustItem icon={<Truck size={16} />} title="Fast Delivery" note="2–5 days" />
                  <TrustItem icon={<RefreshCw size={16} />} title="Easy Returns" note="7-day window" />
                  <TrustItem icon={<ShieldCheck size={16} />} title="Secure Checkout" note="256-bit SSL" />
                </div>
              </div>

              {/* Spotlight playlist */}
              <div className="lg:col-span-6">
                <HeroPlaylist videos={HERO_VIDEOS} poster={bg} badge="New Drop" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ShopByCategory />

      {/* ============ FEATURED ============ */}
      <FeaturedCollection />

      {/* ============ OLDIES BUT GOLDIES ============ */}
      <OldiesGoldies />

      {/* ============ SHOP BY CLUB ============ */}
      <ShopByClub
        onSelect={(team: ClubTeam) => {
          const url = new URL(window.location.href);
          url.searchParams.set("club", team.slug);
          window.history.pushState({}, "", url);
          window.dispatchEvent(new CustomEvent("kaizen:club-selected", { detail: team }));
        }}
      />

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-neutral-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <a href="/" className="inline-flex items-center gap-3">
                <span className="text-lg font-extrabold tracking-[0.16em] text-white">KAIZEN</span>
              </a>
              <p className="mt-2 text-sm text-white/70 max-w-xs">
                Performance essentials engineered for the long run.
              </p>
              <div className="mt-4 flex items-center gap-2">
                {[
                  { Icon: Instagram, label: "Instagram", href: "#" },
                  { Icon: Twitter, label: "Twitter / X", href: "#" },
                  { Icon: Youtube, label: "YouTube", href: "#" },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/20 transition"
                  >
                    <Icon size={16} className="text-white" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white/90">Quick Links</h4>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  { label: "Featured", href: "#featured" },
                  { label: "Oldies but Goldies", href: "#goldies" },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-white/70 hover:text-white transition">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white/90">Contact</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href="mailto:support@kaizen.com"
                    className="inline-flex items-center gap-2 text-white/80 hover:text-white transition"
                  >
                    <Mail size={16} /> support@kaizen.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+10000000000"
                    className="inline-flex items-center gap-2 text-white/80 hover:text-white transition"
                  >
                    <Phone size={16} /> +1 (000) 000-0000
                  </a>
                </li>
                <li className="inline-flex items-center gap-2 text-white/60">
                  <MapPin size={16} /> Cairo, EG
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
            <p className="text-xs text-white/50">© {new Date().getFullYear()} KAIZEN. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs">
              <a href="/privacy" className="text-white/60 hover:text-white transition">Privacy</a>
              <span className="text-white/20" aria-hidden>•</span>
              <a href="/terms" className="text-white/60 hover:text-white transition">Terms</a>
              <span className="text-white/20" aria-hidden>•</span>
              <a href="/support" className="text-white/60 hover:text-white transition">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* -------------------- Shared bits -------------------- */
function TrustItem({
  icon, title, note,
}: { icon: React.ReactNode; title: string; note: string }) {
  return (
    <div
      className={[
        "group inline-flex items-center gap-2 rounded-lg",
        "border border-white/12 bg-white/[0.06] backdrop-blur mt-12",
        "px-2.5 py-1.5 md:px-3 md:py-1.5",
        "transition-all duration-200 ease-[cubic-bezier(.22,.61,.36,1)]",
        "hover:bg-white/[0.10] hover:border-white/20",
        "hover:shadow-[0_4px_14px_rgba(0,0,0,0.25)]",
      ].join(" ")}
    >
      <span
        className={[
          "grid place-items-center shrink-0",
          "size-5 md:size-6 rounded-md",
          "bg-white/95 text-black",
          "shadow-sm transition-transform duration-200 group-hover:scale-[1.04]",
        ].join(" ")}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 leading-tight">
        <div className="text-[12.5px] md:text-[13px] font-semibold tracking-tight">{title}</div>
        <div className="text-[11px] text-white/70 truncate">{note}</div>
      </div>
    </div>
  );
}

/* =================== Hero Playlist =================== */
type ResizeObserverLike = { observe: (el: Element) => void; disconnect: () => void; };

function HeroPlaylist({
  videos, poster, badge,
}: { videos: string[]; poster?: string; badge?: string }) {
  const DURATION = 520;
  const [idx, setIdx] = useState(0);
  const total = videos.length;

  const [offsetPct, setOffsetPct] = useState<number>(-100);
  const [transitionOn, setTransitionOn] = useState<boolean>(true);
  const [animating, setAnimating] = useState<boolean>(false);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const currentRef = React.useRef<HTMLVideoElement | null>(null);
  const [containerW, setContainerW] = useState<number>(0);

  useEffect(() => {
    const el = containerRef.current as HTMLDivElement | null;
    if (!el) return;

    const measure = () => setContainerW(el.clientWidth);
    measure();

    let ro: ResizeObserverLike | null = null;
    if (typeof window !== "undefined" && "ResizeObserver" in window) {
      const RO = (window as unknown as { ResizeObserver: new (cb: ResizeObserverCallback) => ResizeObserverLike }).ResizeObserver;
      ro = new RO(() => measure());
      ro.observe(el);
    } else if (typeof globalThis !== "undefined" && typeof (globalThis ).addEventListener === "function") {
      // fallback (avoid TS narrowing issue)
      (globalThis ).addEventListener("resize", measure);
    }

    return () => {
      ro?.disconnect();
      if (typeof globalThis !== "undefined" && typeof (globalThis).removeEventListener === "function") {
        (globalThis ).removeEventListener("resize", measure);
      }
    };
  }, []);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const prevIdx = (idx - 1 + total) % total;

  const snapWithoutTransition = (targetPct: number) => {
    setTransitionOn(false);
    setOffsetPct(targetPct);
    requestAnimationFrame(() => requestAnimationFrame(() => setTransitionOn(true)));
  };

  const slide = useCallback(
    (direction: "next" | "prev") => {
      if (animating || total < 2) return;
      setAnimating(true);
      setOffsetPct(direction === "next" ? -200 : 0);
      window.setTimeout(() => {
        setIdx((i) => (direction === "next" ? (i + 1) % total : (i - 1 + total) % total));
        snapWithoutTransition(-100);
        setAnimating(false);
      }, DURATION);
    },
    [animating, total]
  );

  const next = useCallback(() => slide("next"), [slide]);
  const prev = useCallback(() => slide("prev"), [slide]);

  useEffect(() => {
    const v = currentRef.current;
    if (!v) return;
    v.load();
    const p = v.play?.();
    if (p && typeof p.then === "function") p.catch(() => {});
  }, [idx]);

  useEffect(() => {
    const el = containerRef.current as HTMLDivElement | null;
    if (!el) return;

    const onKey: EventListener = (e) => {
      const ke = e as KeyboardEvent;
      if (ke.key === "ArrowRight") { ke.preventDefault(); next(); }
      else if (ke.key === "ArrowLeft") { ke.preventDefault(); prev(); }
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (reducedMotion || total === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-white/10 ring-1 ring-white/10">
        {badge ? (
          <div className="absolute left-3 top-3 z-20 rounded-full bg-white text-black text-xs font-semibold px-2 py-1 shadow">
            {badge}
          </div>
        ) : null}
        <img src={poster} alt="" className="w-full h-full aspect-[16/9] object-cover" />
      </div>
    );
  }

  const offsetPx = (offsetPct / 100) * containerW;
  const trackStyle: React.CSSProperties = {
    transform: `translate3d(${offsetPx}px,0,0)`,
    willChange: "transform",
    transition: transitionOn ? `transform ${DURATION}ms cubic-bezier(.22,.61,.36,1)` : "none",
    backgroundColor: "black",
  };

  const brandBgStyle: React.CSSProperties = {
    transform: `translate3d(${offsetPx / 2}px,0,0)`,
    transition: transitionOn ? `transform ${DURATION}ms cubic-bezier(.22,.61,.36,1)` : "none",
    backgroundImage: `radial-gradient(ellipse at center, rgba(255,255,255,0.06), rgba(255,255,255,0) 60%), url(${kaizenLogo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "40% auto",
    opacity: 0.14,
    pointerEvents: "none",
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      aria-label="Hero product video"
      className="group relative rounded-2xl overflow-hidden border border-white/10 ring-1 ring-white/10 shadow-[0_10px_45px_rgba(0,0,0,0.45)] outline-none bg-black"
      style={{ backfaceVisibility: "hidden", WebkitFontSmoothing: "antialiased" }}
    >
      <div className="absolute inset-0 z-0" style={brandBgStyle} aria-hidden />
      <div className="relative z-10 flex" style={trackStyle}>
        <div className="shrink-0 basis-full">
          <video
            key={`prev-${videos[prevIdx]}`}
            className="w-full h-full aspect-[16/9] object-cover block"
            autoPlay muted playsInline controls={false} preload="metadata" poster={poster}
          >
            <source src={videos[prevIdx]} type="video/mp4" />
          </video>
        </div>
        <div className="shrink-0 basis-full">
          <video
            key={`current-${videos[idx]}`}
            ref={currentRef}
            className="w-full h-full aspect-[16/9] object-cover block"
            autoPlay muted loop={false} playsInline controls={false} preload="metadata" poster={poster}
            onEnded={() => next()}
          >
            <source src={videos[idx]} type="video/mp4" />
          </video>
        </div>
        <div className="shrink-0 basis-full">
          <video
            key={`next-${videos[(idx + 1) % total]}`}
            className="w-full h-full aspect-[16/9] object-cover block"
            autoPlay muted playsInline controls={false} preload="metadata" poster={poster}
          >
            <source src={videos[(idx + 1) % total]} type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-20 bg-gradient-to-r from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-20 bg-gradient-to-l from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute inset-0 z-30 flex items-center justify-between px-2">
        <HeroNavButton label="Previous" icon={<ChevronLeft size={18} />} onClick={() => prev()} side="left" />
        <HeroNavButton label="Next" icon={<ChevronRight size={18} />} onClick={() => next()} side="right" />
      </div>
    </div>
  );
}

function HeroNavButton({
  label, icon, onClick, side,
}: { label: string; icon: React.ReactNode; onClick: () => void; side: "left" | "right" }) {
  return (
    <div
      className={[
        "relative",
        side === "left" ? "justify-self-start" : "justify-self-end",
        "opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onClick}
        className={[
          "peer inline-flex items-center justify-center h-12 w-12 rounded-full",
          "bg-white/90 text-black shadow-lg ring-1 ring-black/5 backdrop-blur",
          "transition-all duration-200 hover:scale-105 hover:shadow-xl hover:ring-black/10 active:scale-95",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        ].join(" ")}
        aria-label={label}
      >
        {icon}
      </button>
      <div
        className={[
          "pointer-events-none absolute top-full mt-2 px-2 py-1 rounded-lg text-xs font-medium",
          "text-black bg-white/95 shadow ring-1 ring-black/5",
          "opacity-0 peer-hover:opacity-100 peer-focus:opacity-100 transition-opacity duration-150",
          side === "left" ? "left-0" : "right-0",
        ].join(" ")}
      >
        {label}
      </div>
    </div>
  );
}
