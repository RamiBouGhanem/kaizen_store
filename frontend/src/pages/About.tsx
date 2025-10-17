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
          style={{
            minHeight: "calc(70vh - 4rem)",
          }}
        >
          {/* Ambient background grid + vignette */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(140%_120%_at_80%_0%,rgba(0,0,0,0.18),rgba(0,0,0,0.85))]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />
            <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:44px_44px]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-12">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Copy (left) */}
              <div className="lg:col-span-7">
                <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-[1.05]">
                  Built on{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/75">
                    continuous improvement
                  </span>
                  .
                </h1>
                <p className="mt-5 text-white/85 text-lg md:text-xl leading-relaxed max-w-2xl">
                  KAIZEN is a commitment: to move with purpose, to refine the
                  details, and to earn performance through deliberate progress.
                  From fabrics to fit, we iterate until it disappears in motion.
                </p>
                <div className="mt-7 flex gap-3">
                  <a
                    href="/collections"
                    className="inline-flex items-center gap-2 rounded-xl bg-white text-black px-5 py-2.5 text-sm font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    Explore Collections <ChevronRight size={16} />
                  </a>
                  <a
                    href="/shop"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/25"
                  >
                    Shop Now
                  </a>
                </div>
              </div>

              {/* Logo presentation (right) */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto w-full max-w-sm">
                  {/* floating glow */}
                  <div
                    aria-hidden
                    className="absolute -inset-8 blur-3xl opacity-40 bg-[conic-gradient(from_140deg,rgba(255,255,255,0.25),transparent_40%,rgba(255,255,255,0.15),transparent_70%)] rounded-[28px]"
                  />
                  {/* glass card with subtle tilt on hover */}
                  <div
                    className="relative rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur p-6 shadow-[0_15px_60px_rgba(0,0,0,0.45)]
                               transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1"
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
                      className="absolute -top-6 left-1/2 -translate-x-1/2 h-24 w-24 rounded-full bg-white/15 blur-2xl"
                    />
                    {/* logo */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                      <img
                        src={kaizenLogo}
                        alt="KAIZEN"
                        className="absolute inset-0 h-full w-full object-contain scale-[1.15] p-4 will-change-transform"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </div>

                    {/* caption */}
                    <div className="mt-4 text-center">
                      <div className="text-sm font-semibold">
                        Relentless pursuit of better.
                      </div>
                      <div className="text-xs text-white/70">
                        Performance refined through iteration.
                      </div>
                    </div>
                  </div>

                  {/* small stand / base shadow */}
                  <div
                    aria-hidden
                    className="mx-auto mt-5 h-2 w-36 rounded-full bg-black/50 blur-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="bg-neutral-950 border-t border-white/10" id="contact">
        <div className="max-w-7xl mx-auto px-4 py-4">
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


