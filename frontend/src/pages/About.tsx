// src/pages/About.tsx
import Header from "../components/Header";
import { ChevronRight } from "lucide-react";

import kaizenLogo from "../assets/kaizen-logo.png";

export default function About() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header title="KAIZEN" cartCount={0} />

      {/* ===================== HERO (Pro split: copy left, logo right) ===================== */}
      <section className="relative border-b border-white/10">
        <div
          className="relative overflow-hidden"
          style={{ minHeight: "calc(70vh - 4rem)" }}
        >
          {/* Ambient background grid + vignette */}
          <div className="pointer-events-none absolute inset-0">
            {/* soften effects on mobile, full on md+ */}
            <div className="absolute inset-0 md:bg-[radial-gradient(140%_120%_at_80%_0%,rgba(0,0,0,0.18),rgba(0,0,0,0.85))]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />
            <div className="absolute inset-0 opacity-[0.03] md:opacity-[0.05] bg-[linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:44px_44px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 lg:py-14">
            {/* On mobile: logo first, then copy. Desktop unchanged */}
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Logo presentation (right on desktop, top on mobile) */}
              <div className="lg:col-span-5 order-1 lg:order-none">
                <div className="relative mx-auto w-full max-w-[14rem] sm:max-w-xs md:max-w-sm">
                  {/* floating glow (reduce intensity on small screens) */}
                  <div
                    aria-hidden
                    className="absolute -inset-6 sm:-inset-8 blur-2xl sm:blur-3xl opacity-30 sm:opacity-40 bg-[conic-gradient(from_140deg,rgba(255,255,255,0.25),transparent_40%,rgba(255,255,255,0.15),transparent_70%)] rounded-[28px] hidden md:block"
                  />
                  {/* glass card with subtle lift on hover (hover only matters desktop) */}
                  <div
                    className="relative rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur p-4 sm:p-5 md:p-6 shadow-[0_15px_60px_rgba(0,0,0,0.45)]
                               transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] md:hover:-translate-y-1"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* inner ring */}
                    <div
                      aria-hidden
                      className="absolute inset-0 rounded-3xl ring-1 ring-white/10"
                    />
                    {/* subtle spotlight */}
                    <div
                      aria-hidden
                      className="absolute -top-6 left-1/2 -translate-x-1/2 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full bg-white/15 blur-xl md:blur-2xl"
                    />
                    {/* logo — fill the bordered frame */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                      <img
                        src={kaizenLogo}
                        alt="KAIZEN"
                        className="absolute inset-0 h-full w-full object-cover will-change-transform"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        sizes="(max-width: 640px) 224px, (max-width: 768px) 280px, 360px"
                      />
                    </div>

                    {/* caption */}
                    <div className="mt-4 text-center">
                      <div className="text-sm sm:text-[15px] font-semibold">
                        Relentless pursuit of better.
                      </div>
                      <div className="text-xs sm:text-sm text-white/70">
                        Performance refined through iteration.
                      </div>
                    </div>
                  </div>

                  {/* small stand / base shadow */}
                  <div
                    aria-hidden
                    className="mx-auto mt-5 h-2 w-28 sm:w-36 rounded-full bg-black/50 blur-md"
                  />
                </div>
              </div>

              {/* Copy (left on desktop, bottom on mobile) */}
              <div className="lg:col-span-7 order-2 lg:order-none text-center lg:text-left">
                <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] lg:leading-[1.05]">
                  Built on{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/75">
                    continuous improvement
                  </span>
                  .
                </h1>
                <p className="mt-4 sm:mt-5 text-white/85 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  KAIZEN is a commitment: to move with purpose, to refine the
                  details, and to earn performance through deliberate progress.
                  From fabrics to fit, we iterate until it disappears in motion.
                </p>

                {/* Actions: stack on mobile, inline from sm+ */}
                <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-3">
                  <a
                    href="/collections"
                    className="inline-flex justify-center items-center gap-2 rounded-xl bg-white text-black px-5 py-2.5 text-sm font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30 w-full sm:w-auto"
                  >
                    Explore Collections <ChevronRight size={16} />
                  </a>
                  <a
                    href="/shop"
                    className="inline-flex justify-center items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25 w-full sm:w-auto"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-neutral-950 border-t border-white/10" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[12px] text-white/55">
              © {new Date().getFullYear()} KAIZEN. All rights reserved.
            </p>
            <a
              href="mailto:support@kaizen.com"
              className="text-[12px] text-white/75 hover:text-white transition"
            >
              support@kaizen.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
