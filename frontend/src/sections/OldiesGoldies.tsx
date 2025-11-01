// src/sections/OldiesGoldies.tsx
import React, { useEffect, useRef, useState } from "react";

const assets = import.meta.glob("../assets/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function findAsset(names: string[]) {
  for (const n of names) {
    const rx = new RegExp(`${n}\\.(png|jpe?g|webp|avif)$`, "i");
    const hit = Object.entries(assets).find(([p]) => rx.test(p));
    if (hit) return hit[1];
  }
  return "";
}
const FALLBACK_IMG = findAsset(["football-tshirt", "football_tshirt", "classic-jersey", "jersey"]);

const toAbs = (apiBase?: string, img?: string | null) => {
  if (!img) return "";
  const s = String(img).trim().replace(/^\.?\/*/, "");
  if (/^https?:\/\//i.test(s)) return s;
  try { return new URL(s, apiBase).toString(); } catch { return s; }
};

type ClassicItem = { 
  id: string | number; 
  title: string; 
  tag: string; 
  images: string[]; 
  price?: number; 
  discountPrice?: number; 
};

const Styles = () => (
  <style>{`
    #goldies { --radius: 18px; --panelRadius: 28px; --bgA: #0b0d11; --bgB: #12151d; --bgC: #181b24; --inkHi: #fff; --inkLo: #cfd2da; --shadowSoft: 0 12px 30px rgba(0,0,0,.35); --shadowDeep: 0 10px 45px rgba(0,0,0,.5); }
    .og-bg { position: absolute; inset: 0; z-index: -1; background: radial-gradient(140% 120% at 60% -10%, var(--bgA) 0%, var(--bgA) 30%, var(--bgB) 60%, var(--bgC) 100%); }
    .tunnel { position: relative; border-radius: var(--panelRadius); background: linear-gradient(180deg,#0c0e12,var(--bgA)); box-shadow: inset 0 0 60px rgba(0,0,0,.65); overflow: hidden; transform: translateY(10px); transition: transform 0.8s cubic-bezier(.22,.61,.36,1), opacity 0.8s ease; opacity: .96; }
    .tunnel.in-view { transform: translateY(0); opacity: 1; }
    .og-card { border-radius: var(--radius); overflow: hidden; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04); backdrop-filter: blur(6px); box-shadow: var(--shadowSoft); transition: transform .6s cubic-bezier(.22,.61,.36,1), box-shadow .6s ease, filter .6s ease; flex: 0 0 auto; }
    .og-card:hover { transform: translateY(-10px) scale(1.04); box-shadow: 0 25px 55px rgba(0,0,0,.6); filter: brightness(1.12); }
    .nav-btn { position: absolute; top: 50%; transform: translateY(-50%); z-index: 60; width: 46px; height: 46px; display: none; align-items: center; justify-content: center; cursor: pointer; border-radius: 50%; background: rgba(0,0,0,.7); border: 1px solid rgba(255,255,255,.25); backdrop-filter: blur(10px); transition: all .3s ease; }
    .nav-btn:hover { border-color: rgba(255,255,255,.7); transform: translateY(-50%) scale(1.07); }
    .nav-btn.left { left: 14px; } .nav-btn.right { right: 14px; }
    @media (min-width: 1024px) { .nav-btn { display: flex; } }
    .classic-rail { position: sticky; top: calc(50vh - 35%); height: 70%; align-self: center; width: 120px; border-left: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); border-top-left-radius: 28px; border-bottom-left-radius: 28px; backdrop-filter: blur(14px); box-shadow: var(--shadowDeep); display: flex; align-items: center; justify-content: center; z-index: 10; transition: transform 0.8s ease, opacity 0.8s ease; }
    .classic-rail.entering { transform: translateX(0); opacity: 1; }
    .classic-rail.exiting  { transform: translateX(30px); opacity: 0.4; }
    .classic-text { writing-mode: vertical-rl; text-orientation: sideways; font-weight: 900; font-size: 42px; letter-spacing: .08em; background: linear-gradient(180deg, var(--inkHi), var(--inkLo)); -webkit-background-clip: text; color: transparent; transform: rotate(180deg); user-select: none; text-shadow: 0 1px 0 rgba(255,255,255,.18), 0 10px 24px rgba(0,0,0,.5); }
    .fadeUp { opacity: 0; animation: fadeUp .9s cubic-bezier(.22,.61,.36,1) forwards; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; -webkit-overflow-scrolling: touch; }
    .hide-scrollbar::-webkit-scrollbar { display:none; }
    .hscroll { position: relative; display: flex; gap: 1.5rem; overflow-x: auto; overflow-y: hidden; scroll-snap-type: x mandatory; padding: 1.5rem; touch-action: pan-x; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; cursor: grab; }
    .hscroll:active { cursor: grabbing; }
    .og-card-inner-scroll { display: flex; flex-wrap: nowrap; overflow-x: auto; scroll-snap-type: x mandatory; gap: 0.25rem; height: 100%; }
    .og-card-inner-scroll img { flex: 0 0 100%; scroll-snap-align: start; object-fit: cover; width: 100%; height: 100%; }
    .og-card-inner-scroll::-webkit-scrollbar { display:none; }
    .edge-fade { position: relative; pointer-events: none; }
    .edge-fade > .hscroll { pointer-events: auto; }
    .edge-fade:before, .edge-fade:after { content:""; position:absolute; top:0; bottom:0; width:48px; z-index:50; pointer-events:none; transition: opacity .3s ease; }
    .edge-fade:before { left:0; background: linear-gradient(90deg, rgba(0,0,0,.7), transparent); opacity:.85; }
    .edge-fade:after  { right:0; background: linear-gradient(270deg, rgba(0,0,0,.7), transparent); opacity:.85; }
    .edge-fade.hide-left:before  { opacity:0; }
    .edge-fade.hide-right:after  { opacity:0; }
    .progress { position:absolute; left:0; right:0; bottom:0; height:2px; z-index:55; background: rgba(255,255,255,.1); }
    .progress > span { display:block; height:100%; background: rgba(255,255,255,.6); transition: width .3s ease; }
    @media (max-width: 1023px) { .classic-rail { display: none; } }
  `}</style>
);

function useSectionActive(id: string) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return visible;
}

function useArrowScroll(ref: React.RefObject<HTMLDivElement | null>, step = 0.5) {
  return (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const delta = el.clientWidth * step * (dir === "right" ? 1 : -1);
    el.scrollTo({ left: el.scrollLeft + delta, behavior: "smooth" });
  };
}

export default function OldiesGoldies() {
  const [items, setItems] = useState<ClassicItem[]>([
    {
      id: 1,
      title: "Barcelona Retro",
      tag: "Retro",
      images: [
        "/oldiesgoldies-uploads/barca-retro/barca-retro1.png",
        "/oldiesgoldies-uploads/barca-retro/barca-retro2.png"
      ],
      price: 20,
      discountPrice: 14.99
    },
    {
      id: 2,
      title: "Brazil Home 2004",
      tag: "Classic",
      images: [
        "/oldiesgoldies-uploads/brazilhome2004/brazilhome20041.png",
        "/oldiesgoldies-uploads/brazilhome2004/brazilhome20042.png"
      ],
      price: 20,
      discountPrice: 14.99
    },
    {
      id: 3,
      title: "Portugal Home 2002 Retro",
      tag: "Retro",
      images: [
        "/oldiesgoldies-uploads/portugalhome2002retro/portugalhome2002retro1.png",
        "/oldiesgoldies-uploads/portugalhome2002retro/portugalhome2002retro2.png",
        "/oldiesgoldies-uploads/portugalhome2002retro/portugalhome2002retro3.png"
      ],
      price: 20,
      discountPrice: 14.99
    },
    {
      id: 4,
      title: "Real Madrid Home 2012",
      tag: "Classic",
      images: [
        "/oldiesgoldies-uploads/realmadridhome2012/realmadridhome20121.png",
        "/oldiesgoldies-uploads/realmadridhome2012/realmadridhome20122.png",
        "/oldiesgoldies-uploads/realmadridhome2012/realmadridhome20123.png",
      ],
      price: 20,
      discountPrice: 14.99
    },
  ]);

  const active = useSectionActive("goldies");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollByArrow = useArrowScroll(scrollerRef, 0.5);

  useEffect(() => {
    const section = document.getElementById("goldies");
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setAtStart(scrollLeft <= 2);
      setAtEnd(scrollLeft + clientWidth >= scrollWidth - 2);
      setProgress(Math.min(1, Math.max(0, scrollLeft / Math.max(1, scrollWidth - clientWidth))));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update as EventListener);
      window.removeEventListener("resize", update as EventListener);
    };
  }, []);

  return (
    <section id="goldies" className="relative w-full pt-18 pb-24 text-white overflow-hidden">
      <Styles />
      <div className="og-bg" />

      <div className={`max-w-7xl mx-auto px-6 ${active ? "fadeUp" : ""}`}>
        <div className="text-[11px] tracking-[0.28em] text-white/70 uppercase mb-2">CLASSIC FINDS</div>
        <h2 className="text-3xl md:text-4xl font-black">Oldies but Goldies</h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-2 flex gap-6 items-stretch">
        <div className={`tunnel flex-1 relative ${inView ? "in-view" : ""}`}>
          <button className="nav-btn left" onClick={() => scrollByArrow("left")} aria-label="Previous">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" /></svg>
          </button>
          <button className="nav-btn right" onClick={() => scrollByArrow("right")} aria-label="Next">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" /></svg>
          </button>

          <div className={["edge-fade", atStart ? "hide-left" : "", atEnd ? "hide-right" : ""].join(" ")}>
            <div className="progress"><span style={{ width: `${Math.round(progress * 100)}%` }} /></div>

            <div ref={scrollerRef} className="hide-scrollbar hscroll" role="listbox" aria-label="Classic jerseys carousel">
              {items.map((it) => (
                <article
                  key={it.id}
                  className="og-card snap-start w-[75vw] sm:w-[55vw] md:w-[300px] lg:w-[340px]"
                >
                  <div style={{ aspectRatio: "4 / 5" }} className="relative w-full">
                    {it.images && it.images.length > 0 ? (
                      <div className="og-card-inner-scroll">
                        {it.images.map((img, idx) => (
                          <img key={idx} src={img} alt={`${it.title} ${idx + 1}`} loading="lazy" decoding="async" />
                        ))}
                      </div>
                    ) : (
                      <div className="absolute inset-0 grid place-items-center bg-neutral-900 text-white/60">Missing image</div>
                    )}

                    <span className="absolute left-3 top-3 rounded-full bg-white text-black text-[10px] font-black px-2.5 py-1 shadow">{it.tag}</span>

                    <div className="absolute inset-x-3 bottom-3 flex justify-between items-end rounded-[14px] border border-white/10 bg-black/50 backdrop-blur px-3 py-2">
                      <div className="text-sm font-extrabold leading-tight">{it.title}</div>

                      {it.price && it.discountPrice && (
                        <div className="text-right">
                          <span className="text-[11px] text-white/50 line-through block">${it.price}</span>
                          <span className="text-[13px] text-white font-bold block">${it.discountPrice}</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className={`classic-rail ${inView ? "entering" : "exiting"} transition-all`}>
          <span className="classic-text p-14">CLASSIC FINDS</span>
        </div>
      </div>
    </section>
  );
}
