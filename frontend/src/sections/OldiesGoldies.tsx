import React, { useEffect, useMemo, useRef, useState } from "react";

/* ----------------------------------------
   ASSET HANDLING
---------------------------------------- */
const assets = import.meta.glob("../assets/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function findAsset(names: string[]) {
  for (const n of names) {
    const rx = new RegExp(`${n}\\.(png|jpe?g|webp)$`, "i");
    const hit = Object.entries(assets).find(([p]) => rx.test(p));
    if (hit) return hit[1];
  }
  return "";
}

const A_TSHIRT = findAsset(["football-tshirt", "football_tshirt"]); // default fallback

/* ----------------------------------------
   HOOKS
---------------------------------------- */
function useSectionActive(id: string) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return visible;
}

function useArrowScroll(ref: React.RefObject<HTMLDivElement>, step = 0.45) {
  return (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const delta = el.clientWidth * step * (dir === "right" ? 1 : -1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };
}

/* ----------------------------------------
   STYLES
---------------------------------------- */
const Styles = () => (
  <style>{`
    #goldies {
      --radius: 18px;
      --panelRadius: 28px;
      --bgA: #0b0d11;
      --bgB: #12151d;
      --bgC: #181b24;
      --inkHi: #fff;
      --inkLo: #ccc;
      --shadowSoft: 0 12px 30px rgba(0,0,0,.35);
      --shadowDeep: 0 10px 45px rgba(0,0,0,.5);
    }

    .og-bg {
      position: absolute; inset: 0; z-index: -1;
      background: radial-gradient(140% 120% at 60% -10%, var(--bgA) 0%, var(--bgA) 30%, var(--bgB) 60%, var(--bgC) 100%);
    }

    .tunnel {
      position: relative;
      border-radius: var(--panelRadius);
      background: linear-gradient(180deg,#0c0e12,var(--bgA));
      box-shadow: inset 0 0 60px rgba(0,0,0,.65);
      overflow: hidden;
      transform: translateY(10px);
      transition: transform 0.8s cubic-bezier(.22,.61,.36,1), opacity 0.8s ease;
    }

    .tunnel.in-view {
      transform: translateY(0);
      opacity: 1;
    }

    .og-card {
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.04);
      backdrop-filter: blur(6px);
      box-shadow: var(--shadowSoft);
      transition:
        transform .6s cubic-bezier(.22,.61,.36,1),
        box-shadow .6s ease,
        filter .6s ease;
    }
    .og-card:hover {
      transform: translateY(-10px) scale(1.04);
      box-shadow: 0 25px 55px rgba(0,0,0,.6);
      filter: brightness(1.12);
    }

    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 40;
      width: 46px; height: 46px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: rgba(0,0,0,.7);
      border: 1px solid rgba(255,255,255,.25);
      backdrop-filter: blur(10px);
      transition: all .3s ease;
    }
    .nav-btn:hover {
      border-color: rgba(255,255,255,.7);
      transform: translateY(-50%) scale(1.07);
    }
    .nav-btn.left { left: 14px; }
    .nav-btn.right { right: 14px; }

    .classic-rail {
      position: sticky;
      top: calc(50vh - 35%);
      height: 70%;
      align-self: center;
      width: 120px; /* widened for stronger presence */
      border-left: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.05);
      border-top-left-radius: 28px;
      border-bottom-left-radius: 28px;
      backdrop-filter: blur(14px);
      box-shadow: var(--shadowDeep);
      display: flex; align-items: center; justify-content: center;
      z-index: 10;
      transition: transform 0.8s ease, opacity 0.8s ease;
    }
    .classic-rail.entering {
      transform: translateX(0);
      opacity: 1;
    }
    .classic-rail.exiting {
      transform: translateX(30px);
      opacity: 0.4;
    }

    .classic-text {
      writing-mode: vertical-rl;
      text-orientation: sideways;
      font-weight: 900;
      font-size: 42px;
      letter-spacing: .08em;
      background: linear-gradient(180deg, var(--inkHi), var(--inkLo));
      -webkit-background-clip: text;
      color: transparent;
      transform: rotate(180deg);
      user-select: none;
      text-shadow: 0 1px 0 rgba(255,255,255,.18), 0 10px 24px rgba(0,0,0,.5);
    }

    .fadeUp {
      opacity: 0;
      animation: fadeUp .9s cubic-bezier(.22,.61,.36,1) forwards;
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: none; }
    }

    .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
    .hide-scrollbar::-webkit-scrollbar { display:none; }
  `}</style>
);

/* ----------------------------------------
   MAIN COMPONENT
---------------------------------------- */
export default function OldiesGoldies() {
  const active = useSectionActive("goldies");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const scrollByArrow = useArrowScroll(scrollerRef, 0.45);

  const items = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        title: "Classic Jersey",
        tag: "Edition",
        src: A_TSHIRT,
      })),
    []
  );

  useEffect(() => {
    const section = document.getElementById("goldies");
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section id="goldies" className="relative w-full pt-18 pb-24 text-white overflow-hidden">
      <Styles />
      <div className="og-bg" />

      {/* Header */}
      <div className={`max-w-7xl mx-auto px-6 ${active ? "fadeUp" : ""}`}>
        <div className="text-[11px] tracking-[0.28em] text-white/70 uppercase mb-2">
          CLASSIC FINDS
        </div>
        <h2 className="text-3xl md:text-4xl font-black">Oldies but Goldies</h2>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-2 flex gap-6 items-stretch">
        {/* Left: slider */}
        <div
          className={`tunnel flex-1 relative ${
            inView ? "in-view" : ""
          } transition-all`}
        >
          {/* buttons */}
          <button className="nav-btn left" onClick={() => scrollByArrow("left")} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" />
            </svg>
          </button>

          <button className="nav-btn right" onClick={() => scrollByArrow("right")} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" />
            </svg>
          </button>

          {/* cards */}
          <div
            ref={scrollerRef}
            className="hide-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory p-6"
          >
            {items.map((it) => (
              <article
                key={it.id}
                className="og-card snap-start shrink-0 w-[260px] md:w-[300px] lg:w-[340px]"
              >
                <div style={{ aspectRatio: "4 / 5" }} className="relative w-full">
                  <img
                    src={it.src}
                    alt={it.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white text-black text-[10px] font-black px-2.5 py-1 shadow">
                    {it.tag}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-3 bottom-3 rounded-[14px] border border-white/10 bg-black/50 backdrop-blur px-3 py-2">
                    <div className="text-sm font-extrabold leading-tight">{it.title}</div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[11px] text-white/65">Explore</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white text-black px-2 py-1 text-[10px] font-bold">
                        View
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right: Sticky phrase */}
        <div
          className={`classic-rail ${
            inView ? "entering" : "exiting"
          } transition-all`}
        >
          <span className="classic-text p-14">CLASSIC FINDS</span>
        </div>
      </div>
    </section>
  );
}
