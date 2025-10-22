// src/components/Header.tsx
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  X,
  ChevronRight,
  Filter,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

/* ---------------- Shared Data ---------------- */
const TOP_CLUBS = [
  "Real Madrid",
  "FC Barcelona",
  "Manchester United",
  "Bayern Munich",
  "Liverpool",
  "Manchester City",
  "Arsenal",
  "AC Milan",
  "Paris Saint-Germain",
] as const;

/* === WhatsApp Glyph (clean, monochrome) =================================== */
function WhatsAppGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.46 0 .11 5.35.11 11.94c0 2.1.55 4.16 1.61 5.97L0 24l6.25-1.65a11.9 11.9 0 0 0 5.8 1.5h.01c6.59 0 11.94-5.35 11.94-11.94 0-3.19-1.24-6.19-3.48-8.43Zm-8.47 19.1h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.98.99-3.62-.24-.37a9.9 9.9 0 1 1 18.39-5.32c0 5.46-4.44 9.92-9.99 9.92Zm5.77-7.42c-.31-.16-1.85-.91-2.14-1.01-.29-.11-.5-.16-.71.16-.2.31-.81 1.01-.99 1.22-.18.2-.36.23-.67.08-.31-.15-1.3-.48-2.47-1.52-.91-.8-1.53-1.79-1.71-2.1-.18-.31-.02-.48.13-.64.13-.13.31-.36.45-.54.15-.18.2-.31.31-.52.1-.2.05-.39-.03-.54-.08-.16-.71-1.71-.97-2.34-.26-.63-.52-.54-.71-.54l-.61-.01a1.17 1.17 0 0 0-.85.4c-.29.31-1.11 1.08-1.11 2.63 0 1.55 1.14 3.04 1.3 3.25.16.21 2.25 3.43 5.45 4.81.76.33 1.35.52 1.81.67.76.24 1.46.2 2.02.12.62-.09 1.85-.76 2.11-1.5.26-.74.26-1.37.18-1.5-.08-.13-.28-.21-.59-.37Z"
      />
    </svg>
  );
}

/* === Helpers =============================================================== */
const digitsOnly = (s: string) => s.replace(/\D/g, "");
const enc = (s: string) => encodeURIComponent(s);
const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== "undefined" ? (navigator as any).userAgent : ""
  );

function buildWhatsAppUrls(numberRaw: string, message: string) {
  const phone = digitsOnly(numberRaw);
  const text = enc(message);
  return {
    deep: `whatsapp://send?phone=${phone}&text=${text}`,
    api: `https://api.whatsapp.com/send?phone=${phone}&text=${text}&type=phone_number&app_absent=0`,
    web: `https://web.whatsapp.com/send?phone=${phone}&text=${text}`,
  } as const;
}

function openWhatsAppSmart(numberRaw: string, message: string) {
  const urls = buildWhatsAppUrls(numberRaw, message);
  if (isMobile()) {
    const start = Date.now();
    window.location.href = urls.deep;
    setTimeout(() => {
      if (Date.now() - start < 1600) window.location.href = urls.api;
    }, 600);
  } else {
    window.open(urls.web, "_blank", "noopener,noreferrer");
  }
}

/* === Props ================================================================= */
export type HeaderProps = {
  api?: string;
  title?: string;
  // These two may still exist upstream; consume as unused to avoid TS noUnused warnings
  defaultSearch?: string;
  onSearch?: (value: string) => void;
  whatsappNumber?: string;
  whatsappPrefill?: string;
};

const hoverStyle = "hover:text-white transition duration-150 ease-in-out";

/* === CTA Button (WhatsApp) ================================================= */
function WhatsAppButton({
  number,
  message,
  isIconOnly,
  qa,
  label = "DM to Buy",
}: {
  number: string;
  message: string;
  isIconOnly?: boolean;
  qa?: string;
  label?: string;
}) {
  const { web, api } = buildWhatsAppUrls(number, message);
  const hrefForPlatform = isMobile() ? api : web;

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    openWhatsAppSmart(number, message);
  };

  return (
    <a
      href={hrefForPlatform}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      data-qa={qa}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className={[
        "group relative inline-flex h-11 items-center justify-center overflow-hidden",
        "rounded-xl border border-emerald-400/20 bg-emerald-500/10",
        "hover:bg-emerald-500/15 active:bg-emerald-500/20",
        "focus:outline-none focus:ring-2 focus:ring-emerald-400/40",
        "transition-colors",
        isIconOnly ? "w-11" : "px-3 gap-2",
      ].join(" ")}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-2xl bg-emerald-400/10"
        style={{ animation: "kaizen-pulse 2.2s ease-in-out infinite" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -skew-x-12 opacity-0 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.08) 55%, transparent 100%)",
          transform: "translateX(-120%)",
          animation: "kaizen-sheen 900ms cubic-bezier(.22,.61,.36,1) 50ms 1",
        }}
      />
      <WhatsAppGlyph className="relative z-10 h-[18px] w-[18px] text-emerald-300 transition-transform duration-200 group-hover:translate-x-[1px]" />
      {!isIconOnly && (
        <span className="relative z-10 hidden sm:inline text-sm font-medium tracking-wide text-white">
          {label}
        </span>
      )}
    </a>
  );
}

/* === Quick Shop (Desktop Popover) ========================================= */
function QuickShop() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocPointerDown = (e: PointerEvent) => {
      if (!panelRef.current) return;
      // if the pointer down happened outside the popover, close it
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointerDown, {
      passive: true,
    });
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, []);

  const clubs = TOP_CLUBS;

  return (
    <div className="relative z-[70]" ref={panelRef}>
      <button
        // IMPORTANT: stop propagation so the outside handler doesn’t fire immediately
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-expanded={open}
        aria-haspopup="menu"
        className={[
          "group relative inline-flex items-center gap-2 h-11 px-3",
          "rounded-xl overflow-hidden",
          "border border-white/10 bg-white/[0.04] text-white/60",
          "hover:bg-white/10 hover:text-white/90 hover:border-white/20",
          "focus:outline-none focus:ring-2 focus:ring-emerald-400/30",
          "transition",
        ].join(" ")}
      >
        {/* sheen on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -skew-x-12 opacity-0 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0.08) 55%, transparent 100%)",
            transform: "translateX(-120%)",
            animation: "kaizen-sheen 900ms cubic-bezier(.22,.61,.36,1) 60ms 1",
          }}
        />
        <Filter
          size={16}
          className="opacity-70 transition group-hover:opacity-100 group-hover:translate-x-[1px]"
        />
        <span className="text-sm font-medium">Quick Shop</span>
      </button>

      {/* Panel */}
      <div
        role="menu"
        // IMPORTANT: stop propagation so inside clicks don’t bubble and close it
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className={[
          "absolute right-0 mt-2 w-[320px] rounded-2xl border border-white/10",
          "bg-neutral-950/95 supports-[backdrop-filter]:backdrop-blur-xl",
          "shadow-[0_16px_40px_rgba(0,0,0,.45)]",
          "transition-all duration-200 origin-top-right",
          "z-[70]", // keep above header content
          open
            ? "opacity-100 scale-100"
            : "pointer-events-none opacity-0 scale-95",
        ].join(" ")}
      >
        <div className="p-3">
          <div className="flex items-center gap-2 px-2 pb-2">
            <Sparkles size={16} className="text-emerald-300" />
            <span className="text-sm font-semibold text-white/90">
              Featured Filters
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 px-2">
            <Link
              to="/shop"
              className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition group"
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingBag size={16} className="opacity-80" />
                All Products
              </span>
              <ChevronRight
                size={16}
                className="text-white/60 group-hover:translate-x-0.5 transition"
              />
            </Link>

            <Link
              to="/"
              hash="new"
              className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition group"
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles size={16} className="opacity-80" />
                New Arrivals
              </span>
              <ChevronRight
                size={16}
                className="text-white/60 group-hover:translate-x-0.5 transition"
              />
            </Link>
          </div>

          <div className="px-2 pt-3 pb-1">
            <span className="text-xs uppercase tracking-wider text-white/50">
              Top Clubs
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 px-2 pb-2">
            {clubs.map((club) => (
              <Link
                key={club}
                to={`/shop?team=${encodeURIComponent(club)}`}
                className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/10 transition group flex items-center justify-between"
              >
                <span className="truncate">{club}</span>
                <ChevronRight
                  size={16}
                  className="text-white/60 group-hover:translate-x-0.5 transition shrink-0"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* === Main Header =========================================================== */
export default function Header({
  api,
  title = "KAIZEN",
  // consume but don’t use (we removed header search)
  defaultSearch: _defaultSearch,
  onSearch: _onSearch,
  whatsappNumber = "+961 70 439 225",
  whatsappPrefill = "Hello! I’m interested in purchasing a jersey and would like more details.",
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  const wordmark =
    (title || "KAIZEN")
      .replace(/^[^\p{L}\p{N}]+/u, "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase() || "KAIZEN";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 6);
      const max =
        document.documentElement.scrollHeight -
        (window.innerHeight || document.documentElement.clientHeight);
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setScrollPct(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerShell =
    "sticky top-0 z-50 w-full border-b border-white/10 supports-[backdrop-filter]:backdrop-blur-md";
  const headerBg = scrolled
    ? "bg-neutral-950/80 shadow-[0_6px_24px_rgba(0,0,0,0.35)]"
    : "bg-neutral-950/95";

  return (
    <>
      {/* Motion keyframes */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .group [style*="kaizen-pulse"] { animation: none !important; }
          .group [style*="kaizen-sheen"] { animation: none !important; transform: none !important; opacity: 0 !important; }
          .kmove { animation: none !important; }
        }
        @keyframes kaizen-pulse {
          0%   { transform: scale(1);   opacity: 0.14; }
          50%  { transform: scale(1.05); opacity: 0.22; }
          100% { transform: scale(1);   opacity: 0.14; }
        }
        @keyframes kaizen-sheen {
          0%   { transform: translateX(-120%) skewX(-12deg); }
          100% { transform: translateX(120%)  skewX(-12deg); }
        }
      `}</style>

      <header className={`${headerShell} ${headerBg}`} role="banner">
        {/* top progress stripe */}
        <div
          aria-hidden
          className="h-[2px] w-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500/80"
          style={{ maskImage: "linear-gradient(90deg, black, black)" }}
        >
          <div
            className="h-full bg-white/20"
            style={{
              width: `${scrollPct * 100}%`,
              transition: "width 120ms linear",
              boxShadow: "0 0 14px rgba(16,185,129,.45)",
            }}
          />
        </div>

        {!scrolled && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-[0.06]"
          />
        )}

        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div
            className="flex h-[56px] md:h-[72px] items-center gap-2"
            style={{ paddingTop: "env(safe-area-inset-top,0px)" }}
          >
            {/* Mobile menu */}
            <button
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition group"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X
                  size={22}
                  className="text-white transition group-hover:rotate-90"
                />
              ) : (
                <Menu
                  size={22}
                  className="text-white transition group-hover:rotate-12"
                />
              )}
            </button>

            {/* Brand */}
            <Link
              to="/"
              className="relative inline-flex items-center gap-2 select-none group/wordmark"
              aria-label={`${wordmark} – Home`}
            >
              <span className="relative inline-flex items-center">
                <span
                  aria-hidden
                  className="absolute -inset-x-4 -inset-y-2 opacity-0 group-hover/wordmark:opacity-100 transition-opacity duration-300"
                >
                  <span className="block h-full w-full blur-2xl rounded-2xl bg-[radial-gradient(50%_50%_at_50%_50%,rgba(16,185,129,0.28),transparent)]" />
                </span>

                <span
                  className="relative uppercase font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 text-[18px] md:text-[24px] tracking-[0.18em] transition group-hover/wordmark:scale-[1.03] group-hover/wordmark:text-white"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {wordmark}
                </span>
              </span>

              <span
                className="relative hidden md:inline-block h-4 w-px bg-white/15"
                aria-hidden
              />
              {/* Tagline (independent hover) */}
              <span className="relative hidden sm:inline group/tagline ml-2">
                <span
                  className="
                    relative text-[10px] md:text-[12px] mt-1 tracking-wide
                    text-white
                    bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400
                    transition-colors duration-200
                    group-hover/tagline:text-transparent
                  "
                >
                  Endure. Adapt. Improve.
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-4 ml-6"
              aria-label="Main"
            >
              {[
                { label: "Shop", to: "/shop" as const },
                { label: "New", to: "/", hash: "new" as const },
                { label: "Collections", to: "/", hash: "trending" as const },
                { label: "About", to: "/about" as const },
              ].map((item) =>
                "hash" in item ? (
                  <Link
                    key={item.label}
                    to="/"
                    hash={item.hash}
                    className={`relative text-sm font-medium text-white/70 ${hoverStyle} group`}
                    activeOptions={{ exact: true }}
                    activeProps={{ className: "text-white" }}
                  >
                    <span className="inline-block">
                      {item.label}
                      <span className="block h-[2px] scale-x-0 bg-emerald-400/80 transition-transform duration-200 origin-left group-hover:scale-x-100" />
                    </span>
                  </Link>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`relative text-sm font-medium text-white/70 ${hoverStyle} group`}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{ className: "text-white" }}
                  >
                    <span className="inline-block">
                      {item.label}
                      <span className="block h-[2px] scale-x-0 bg-emerald-400/80 transition-transform duration-200 origin-left group-hover:scale-x-100" />
                    </span>
                  </Link>
                )
              )}
            </nav>

            <div className="ml-auto" />

            {/* Desktop: Quick Shop + WhatsApp */}
            <div className="hidden md:flex items-center gap-2">
              <QuickShop />
              <WhatsAppButton
                number={whatsappNumber}
                message={whatsappPrefill}
                qa="cta-whatsapp"
              />
            </div>

            {/* Mobile CTA */}
            <div className="flex md:hidden items-center gap-1">
              <Link
                to="/shop"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition group"
                aria-label="Shop now"
              >
                <ShoppingBag
                  size={18}
                  className="mr-1 opacity-80 group-hover:opacity-100"
                />
                Shop
              </Link>
              <WhatsAppButton
                number={whatsappNumber}
                message={whatsappPrefill}
                isIconOnly
                qa="cta-whatsapp-mobile"
              />
            </div>
          </div>
        </div>

        {/* Mobile nav sheet */}
        <div
          className={[
            "md:hidden border-t border-white/10",
            "overflow-hidden",
            open ? "max-h-[70vh]" : "max-h-0",
            "bg-neutral-950/90 supports-[backdrop-filter]:backdrop-blur-md",
            "transition-[max-height] duration-300",
          ].join(" ")}
          role="dialog"
          aria-label="Mobile navigation"
        >
          <nav className="px-3 sm:px-4 py-2 grid gap-2">
            {[
              { label: "Shop", to: "/shop" as const },
              { label: "New", to: "/", hash: "new" as const },
              { label: "Collections", to: "/", hash: "trending" as const },
              { label: "About", to: "/about" as const },
            ].map((item) =>
              "hash" in item ? (
                <Link
                  key={item.label}
                  to="/"
                  hash={item.hash}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white/90 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition group"
                  activeOptions={{ exact: true }}
                >
                  <span className="text-sm transition group-hover:translate-x-1">
                    {item.label}
                  </span>
                  <ChevronRight
                    size={18}
                    className="text-white/60 transition group-hover:text-white/80 group-hover:translate-x-0.5"
                  />
                </Link>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white/90 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition group"
                  activeOptions={{ exact: item.to === "/" }}
                >
                  <span className="text-sm transition group-hover:translate-x-1">
                    {item.label}
                  </span>
                  <ChevronRight
                    size={18}
                    className="text-white/60 transition group-hover:text-white/80 group-hover:translate-x-0.5"
                  />
                </Link>
              )
            )}
          </nav>

          {/* === Quick Shop (Mobile, inline) === */}
          <div className="px-3 sm:px-4 pb-4 mt-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04]">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <Filter size={16} className="opacity-80" />
                <span className="text-sm font-semibold text-white/90">
                  Quick Shop
                </span>
              </div>

              {/* Featured Filters */}
              <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link
                  to="/shop"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition group"
                >
                  <span className="inline-flex items-center gap-2">
                    <ShoppingBag size={16} className="opacity-80" />
                    All Products
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-white/60 group-hover:translate-x-0.5 transition"
                  />
                </Link>

                <Link
                  to="/"
                  hash="new"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition group"
                >
                  <span className="inline-flex items-center gap-2">
                    <Sparkles size={16} className="opacity-80" />
                    New Arrivals
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-white/60 group-hover:translate-x-0.5 transition"
                  />
                </Link>
              </div>

              {/* Top Clubs */}
              <div className="px-4 pb-2">
                <span className="text-xs uppercase tracking-wider text-white/50">
                  Top Clubs
                </span>
              </div>
              <div className="px-3 pb-3 grid grid-cols-2 gap-2">
                {TOP_CLUBS.map((club) => (
                  <Link
                    key={club}
                    to={`/shop?team=${encodeURIComponent(club)}`}
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/10 transition group flex items-center justify-between"
                  >
                    <span className="truncate">{club}</span>
                    <ChevronRight
                      size={16}
                      className="text-white/60 group-hover:translate-x-0.5 transition shrink-0"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
