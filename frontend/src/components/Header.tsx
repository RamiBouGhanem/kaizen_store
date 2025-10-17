// src/components/Header.tsx
import { useEffect, useRef, useState } from "react";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
import { Link } from "@tanstack/react-router";

type HeaderProps = {
  api?: string;
  title?: string; // wordmark text (default "KAIZEN")
  cartCount?: number;
  defaultSearch?: string;
  onSearch?: (value: string) => void;
};

type NavItem =
  | { label: "Shop" | "About"; to: "/" | "/about" }
  | { label: "New" | "Collections"; to: "/"; hash: "new" | "trending" };

export default function Header({
  api,
  title = "KAIZEN",
  cartCount = 0,
  defaultSearch = "",
  onSearch,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState(defaultSearch);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll → elevate/blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!onSearch) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => onSearch(q), 250);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q, onSearch]);

  // "/" focuses search (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /input|textarea|select/i.test(t.tagName)) return;
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const headerClasses = [
    "sticky top-0 z-50 w-full border-b transition-[background,box-shadow] duration-300",
    "supports-[backdrop-filter]:backdrop-blur-md",
    scrolled
      ? "bg-neutral-950/60 border-white/10 shadow-[0_6px_28px_rgba(0,0,0,0.35)]"
      : "bg-neutral-950/90 border-white/10",
  ].join(" ");

  const wordmark =
    (title || "KAIZEN")
      .replace(/^[^\p{L}\p{N}]+/u, "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase() || "KAIZEN";

  const navItems: NavItem[] = [
    { label: "Shop", to: "/" },
    { label: "New", to: "/", hash: "new" },
    { label: "Collections", to: "/", hash: "trending" },
    { label: "About", to: "/about" },
  ];

  return (
    <>
      {/* A11y skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] bg-black text-white px-3 py-2 rounded-lg"
      >
        Skip to content
      </a>

      <header className={`relative ${headerClasses}`} role="banner">
        {!scrolled && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-[0.07]"
          />
        )}

        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 md:h-20 items-center gap-3">
            {/* Mobile menu */}
            <button
              className="inline-flex items-center justify-center md:hidden rounded-xl border border-white/10 p-2 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/25 transition duration-150"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>

            {/* BRAND */}
            <Link
              to="/"
              className="relative inline-flex items-center gap-3 select-none"
              aria-label={`${wordmark} – Home`}
            >
              <span className="group/wordmark relative inline-flex items-center">
                <span
                  aria-hidden
                  className="absolute -inset-x-6 -inset-y-3 opacity-0 group-hover/wordmark:opacity-100 transition-opacity duration-300"
                >
                  <span className="block h-full w-full blur-2xl rounded-2xl bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.25),transparent)]" />
                </span>

                <span
                  className="relative uppercase font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/80 text-[20px] md:text-[24px] tracking-[0.18em] transition duration-300 group-hover/wordmark:from-white group-hover/wordmark:to-white"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {wordmark}
                </span>
              </span>

              <span className="relative hidden md:inline-block h-4 w-px bg-white/15" aria-hidden />

              <span className="relative hidden sm:inline text-[11px] md:text-[12px] mt-2 tracking-wide text-white/60 transition-all duration-300 hover:-translate-y-px">
                <span className="inline-block relative transition duration-300" style={{ color: "currentColor" }}>
                  Endure. Adapt. Improve.
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 block text-transparent bg-clip-text opacity-0 transition-opacity duration-300 hover:opacity-100"
                  style={{ backgroundImage: "linear-gradient(to right, #B87333 0%, #D8D8D8 50%, #465561 100%)" }}
                >
                  Endure. Adapt. Improve.
                </span>
              </span>
            </Link>

            {/* Primary nav */}
            <nav aria-label="Primary" className="hidden md:flex items-center gap-1 ml-4">
              {navItems.map((item) =>
                "hash" in item ? (
                  // Hash links: same route ("/") + a hash segment
                  <Link
                    key={item.label}
                    to="/"
                    hash={item.hash}
                    className="relative px-3 py-2 text-sm rounded-lg transition duration-150 group hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 text-white/80 hover:text-white"
                    activeOptions={{ exact: true }}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white/70 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0 group-focus:w-full group-focus:left-0"
                    />
                  </Link>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="relative px-3 py-2 text-sm rounded-lg transition duration-150 group hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 text-white/80 hover:text-white"
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-white/70 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0 group-focus:w-full group-focus:left-0"
                    />
                  </Link>
                )
              )}
            </nav>

            <div className="ml-auto" />

            {/* Desktop search */}
            <div className="hidden md:flex items-center">
              <div className="relative group">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none transition duration-200 group-focus-within:text-white"
                />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={api ? "Search products… (/)" : "Search… (/)"}
                  className={[
                    "w-72 lg:w-96 rounded-xl bg-white/10 text-white placeholder-white/60",
                    "border border-white/10 pl-9 pr-10 py-2 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-white/30",
                    "transition-all duration-200",
                    "group-focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.10)_inset] group-focus-within:bg-white/15",
                  ].join(" ")}
                  aria-label="Search products"
                />
                <span
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-white/15 px-1.5 py-0.5 text-[11px] text-white/60 transition duration-200 group-focus-within:border-white/30 group-focus-within:text-white/80"
                  aria-hidden
                >
                  /
                </span>
              </div>
            </div>

            {/* Desktop cart */}
            <div className="hidden md:block">
              <CartButton count={cartCount} />
            </div>

            {/* Mobile actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setShowMobileSearch((v) => !v)}
                aria-expanded={showMobileSearch}
                aria-controls="mobile-search"
                className="rounded-xl border border-white/10 p-2 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/25 transition duration-150"
                aria-label="Toggle search"
              >
                <Search size={20} className="text-white" />
              </button>
              <CartButton count={cartCount} />
            </div>
          </div>
        </div>

        {/* Mobile search drawer */}
        <div
          id="mobile-search"
          className={[
            "md:hidden border-t border-white/10 overflow-hidden",
            "transition-[max-height] duration-300",
            showMobileSearch ? "max-h-24" : "max-h-0",
            "bg-neutral-950/90 supports-[backdrop-filter]:backdrop-blur-md",
          ].join(" ")}
        >
          <div className="px-4 py-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/10 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-white/30 transition duration-150"
                aria-label="Search products"
              />
            </div>
          </div>
        </div>

        {/* Mobile nav sheet */}
        <div
          className={[
            "md:hidden border-t border-white/10",
            "transition-[max-height] duration-300 overflow-hidden",
            open ? "max-h-[60vh]" : "max-h-0",
            "bg-neutral-950/90 supports-[backdrop-filter]:backdrop-blur-md",
          ].join(" ")}
          role="dialog"
          aria-label="Mobile navigation"
        >
          <nav className="px-4 py-3 grid gap-1">
            {navItems.map((item) =>
              "hash" in item ? (
                <Link
                  key={item.label}
                  to="/"
                  hash={item.hash}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition duration-150"
                  activeOptions={{ exact: true }}
                >
                  <span className="text-sm">{item.label}</span>
                  <span className="text-xs text-white/60">Explore</span>
                </Link>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition duration-150"
                  activeOptions={{ exact: item.to === "/" }}
                >
                  <span className="text-sm">{item.label}</span>
                  <span className="text-xs text-white/60">Explore</span>
                </Link>
              )
            )}
          </nav>
        </div>
      </header>

      {/* Tip: add in global CSS to highlight active links */}
      {/* a[aria-current="page"] { color: #fff; font-weight: 600; } */}
    </>
  );
}

// Keep anchor until you add a /cart route in your router.
function CartButton({ count = 0 }: { count?: number }) {
  return (
    <a
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/25 transition duration-150 hover:shadow-white/20 hover:shadow-lg"
      aria-label="Cart"
    >
      <ShoppingCart size={18} className="text-white transition duration-150" />
      <span className="hidden sm:inline text-sm text-white/90 transition duration-150">Cart</span>
      {count > 0 && (
        <span
          className="absolute -top-1 -right-1 grid place-items-center min-w-[18px] h-[18px] rounded-full text-[11px] bg-white text-black font-semibold px-1"
          aria-label={`${count} items in cart`}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </a>
  );
}
