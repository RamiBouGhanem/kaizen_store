// src/pages/Shop.tsx
import React from "react";
import Header from "../components/Header";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import footballTshirt from "../assets/football-tshirt.jpeg";
import { useSearch } from "@tanstack/react-router";

/* ================== Types ================== */
type ApiProduct = {
  _id: string;
  title: string;
  price: number;
  images: string[];
  kitType?: string;
  team?: string;
  season?: string;
};
type FeaturedItem = {
  id: string;
  title: string;
  price: string; // new price
  oldPrice?: string; // old price
  images: string[];
  team?: string;
  kitType?: string;
  season?: string;
  badge?: string;
};

const mapApiToItems = (list: ApiProduct[], apiBase: string): FeaturedItem[] =>
  (list ?? []).map((p) => {
    const imgs = (Array.isArray(p.images) ? p.images : []).map((img) => {
      if (!img) return footballTshirt;
      let s = img.replace(/^\.?\/*/, "");
      s = s.replace(/^uploads\/products\//i, "uploads/");
      if (!/\.[a-z]{3,4}$/i.test(s)) s = s + ".jpg";
      return /^https?:\/\//i.test(s) ? s : `${apiBase}/${s}`;
    });

    return {
      id: String(p._id),
      title: p.title,
      price: typeof p.price === "number" ? `$${p.price.toFixed(2)}` : "$14.99",
      oldPrice: "$20.00", // default old price
      images: imgs.length ? imgs : [footballTshirt],
      team: p.team,
      kitType: p.kitType,
      season: p.season,
      badge: p.kitType,
    };
  });

function useDebounced<T>(value: T, delay = 120) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

function setSearchParam(name: string, value: string | null) {
  if (typeof window === "undefined") return;
  const u = new URL(window.location.href);
  if (!value) u.searchParams.delete(name);
  else u.searchParams.set(name, value);
  window.history.replaceState({}, "", u.toString());
}

function useReveal<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach(
          (e) => e.isIntersecting && (setShown(true), io.disconnect())
        ),
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px", ...(opts || {}) }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, opts]);
  return { ref, shown };
}

/* ====== Search helpers: normalize, synonyms, fuzzy, scoring ====== */
const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const tokenize = (s: string) => normalize(s).split(/\s+/).filter(Boolean);

const SYNONYMS: Record<string, string[]> = {
  jersey: ["kit", "shirt", "top"],
  kit: ["jersey", "shirt", "top"],
  shirt: ["jersey", "kit", "top"],
  top: ["jersey", "kit", "shirt"],
  home: ["primary"],
  away: ["secondary"],
  third: ["alternate", "alt"],
  fan: ["fans", "supporter", "supporters"],
  france: ["french", "fra", "lesbleus", "bleus", "equipedefrance"],
  real: ["rm", "realmadrid"],
  madrid: ["rm", "realmadrid"],
  united: ["manu", "manutd", "manchesterunited"],
  city: ["mcfc", "mancity", "manchestercity"],
  barcelona: ["fcb", "barca", "blaugrana"],
  juventus: ["juve"],
  bayern: ["fcbayern", "munich", "muenchen"],
  brazil: ["selecao", "bra"],
  germany: ["deutschland", "ger", "dfb"],
  spain: ["espana", "esp"],
  italy: ["azzurri", "ita"],
  england: ["threelions", "eng"],
};

// ---- Team aliases (canonical -> variants) ----
const TEAM_ALIASES: Record<string, string[]> = {
  "real madrid": ["realmadrid", "rm", "real"],
  "fc barcelona": ["barcelona", "barça", "barca", "fcb"],
  "fc bayern münchen": [
    "fc bayern munchen",
    "bayern munich",
    "bayern",
    "fcbayern",
    "munich",
    "muenchen",
    "münchen",
  ],
  "manchester city": [
    "man city",
    "mcfc",
    "city",
    "man city fc",
    "manchester city fc",
  ],
  "manchester united": [
    "man united",
    "man utd",
    "manutd",
    "mu",
    "united",
    "manchester united fc",
  ],
  "paris saint-germain": ["psg", "paris sg", "paris saint germain"],
  juventus: ["juve", "juventus fc"],
  "ac milan": ["milan", "acm", "ac milan fc"],
  "inter milan": [
    "inter",
    "internazionale",
    "fc internazionale",
    "inter milano",
    "inter milan fc",
  ],
  "borussia dortmund": ["bvb", "dortmund"],
  "tottenham hotspur": ["spurs", "tottenham"],
  liverpool: ["lfc", "liverpool fc"],
  chelsea: ["cfc", "chelsea fc"],
  arsenal: ["afc", "gunners", "arsenal fc"],
  "atlético madrid": [
    "atletico madrid",
    "atleti",
    "atlético",
    "atletico",
    "atlético de madrid",
  ],
};

const normTeam = (s: string) => normalize(s);

function expandTeamName(name: string): Set<string> {
  const base = normTeam(name);
  const out = new Set<string>([base]);
  for (const [canon, aliases] of Object.entries(TEAM_ALIASES)) {
    const canonN = normTeam(canon);
    const aliN = aliases.map(normTeam);
    if (base === canonN || aliN.includes(base)) {
      out.add(canonN);
      aliN.forEach((a) => out.add(a));
      break;
    }
  }
  return out;
}

// Tiny Levenshtein (<=1)
function editDistance1orLess(a: string, b: string) {
  if (a === b) return true;
  const la = a.length,
    lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0,
    j = 0,
    edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    edits++;
    if (edits > 1) return false;
    if (la > lb) i++;
    else if (lb > la) j++;
    else {
      i++;
      j++;
    }
  }
  if (i < la || j < lb) edits++;
  return edits <= 1;
}

const expandTokens = (tokens: string[]) => {
  const out = new Set<string>();
  for (const t of tokens) {
    out.add(t);
    (SYNONYMS[t] || []).forEach((x) => out.add(x));
  }
  return out;
};

const itemSearchText = (it: FeaturedItem) =>
  normalize(
    [it.title, it.team, it.kitType || it.badge, it.season]
      .filter(Boolean)
      .join(" ")
  );

const itemTokens = (it: FeaturedItem) => new Set(tokenize(itemSearchText(it)));

function scoreItem(it: FeaturedItem, query: string) {
  const qNorm = normalize(query);
  if (!qNorm) return 0.0001;
  const qTokens = tokenize(qNorm);
  const qExpanded = Array.from(expandTokens(qTokens));

  const text = itemSearchText(it);
  const tokens = itemTokens(it);

  let hits = 0;
  if (qNorm && text.includes(qNorm)) hits += 2;

  for (const qt of qTokens) {
    let matched = false;
    if (tokens.has(qt)) matched = true;
    else {
      for (const tk of tokens) {
        if (editDistance1orLess(qt, tk)) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        for (const alt of SYNONYMS[qt] || []) {
          if (tokens.has(alt)) {
            matched = true;
            break;
          }
        }
      }
    }
    if (matched) hits += 1;
  }

  const teamTok = it.team ? normalize(it.team) : "";
  const kitTok = it.kitType ? normalize(it.kitType) : "";
  if (
    teamTok &&
    qExpanded.some((t) => teamTok.includes(t) || t.includes(teamTok))
  )
    hits += 1.25;
  if (kitTok && qExpanded.some((t) => kitTok.includes(t) || t.includes(kitTok)))
    hits += 0.75;

  return hits;
}

function teamMatches(selected: string, value?: string): boolean {
  if (!selected) return true;
  if (!value) return false;
  const s = normTeam(selected);
  const v = normTeam(value);
  if (s === v || v.includes(s) || s.includes(v)) return true;

  const sSet = expandTeamName(selected);
  const vSet = expandTeamName(value);
  for (const a of sSet) {
    for (const b of vSet) {
      if (a === b) return true;
      if (editDistance1orLess(a, b)) return true;
    }
  }
  return false;
}

/* ================== Page ================== */
export default function Shop() {
  // Router-provided search (from /shop?team=..., etc.)
  const routeSearch = useSearch({ from: "/shop" }) as {
    team?: string;
    kitType?: string;
    season?: string;
    q?: string;
    sort?: string;
  };

  // NOTE: VITE_API_URL must include /api (e.g. https://.../api)
  const api = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

  // Initialize local UI state from router search (not window.location)
  const [q, setQ] = React.useState(routeSearch.q ?? "");
  const [team, setTeam] = React.useState(routeSearch.team ?? "");
  const [kitType, setKitType] = React.useState(routeSearch.kitType ?? "");
  const [season, setSeason] = React.useState(routeSearch.season ?? "");
  const [sortParam, setSortParam] = React.useState(
    routeSearch.sort ?? "title:asc"
  );
  const dq = useDebounced(q, 120);

  // Keep local state in sync if URL search changes (e.g., coming from Home CTA)
  React.useEffect(() => {
    if ((routeSearch.q ?? "") !== q) setQ(routeSearch.q ?? "");
    if ((routeSearch.team ?? "") !== team) setTeam(routeSearch.team ?? "");
    if ((routeSearch.kitType ?? "") !== kitType)
      setKitType(routeSearch.kitType ?? "");
    if ((routeSearch.season ?? "") !== season)
      setSeason(routeSearch.season ?? "");
    if ((routeSearch.sort ?? "title:asc") !== sortParam)
      setSortParam(routeSearch.sort ?? "title:asc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    routeSearch.q,
    routeSearch.team,
    routeSearch.kitType,
    routeSearch.season,
    routeSearch.sort,
  ]);

  // UI
  const [openFilters, setOpenFilters] = React.useState(false);

  // Data
  const [raw, setRaw] = React.useState<FeaturedItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  // Fetch
  React.useEffect(() => {
    if (!api) {
      setLoading(false);
      setErr("VITE_API_URL is not set");
      return;
    }
    const ctrl = new AbortController();

    const run = async () => {
      try {
        setLoading(true);
        setErr(null);
        const base = api.endsWith("/") ? api : api + "/";
        const url = new URL("products", base); // <-- NO leading slash; preserves /api
        url.searchParams.set("page", "1");
        url.searchParams.set("limit", "9999");
        url.searchParams.set("sort", "createdAt:desc");
        const href = url.toString();
        // console.log("Fetch products →", href); // helpful while debugging
        const res = await fetch(href, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const arr: ApiProduct[] = Array.isArray(data)
          ? data
          : data?.data?.items ?? data?.items ?? [];
        setRaw(mapApiToItems(arr, api));
      } catch (e: any) {
        if (e?.name !== "AbortError") setErr(e?.message || "Failed to load");
        setRaw([]);
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => ctrl.abort();
  }, [api]);

  const normFacet = (s?: string | null) =>
    (s ?? "").toString().trim().replace(/\s+/g, " ");

  function toUniqueSorted(list: (string | undefined)[]) {
    const map = new Map<string, string>();
    for (const raw of list) {
      const clean = normFacet(raw);
      if (!clean) continue;
      const key = clean.toLowerCase();
      if (!map.has(key)) map.set(key, clean);
    }
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
  }

  const facets = React.useMemo(() => {
    const teams: string[] = [];
    const kits: string[] = [];
    const seasons: string[] = [];
    for (const it of raw) {
      if (it.team) teams.push(it.team);
      if (it.kitType) kits.push(it.kitType);
      else if (it.badge) kits.push(it.badge);
      if (it.season) seasons.push(it.season);
    }
    return {
      teams: toUniqueSorted(teams),
      kits: toUniqueSorted(kits),
      seasons: toUniqueSorted(seasons),
    };
  }, [raw]);

  const filtered = React.useMemo(() => {
    const text = dq.trim();
    const withScores = raw
      .filter((it) => {
        if (team && !teamMatches(team, it.team)) return false;
        if (kitType && (it.kitType || it.badge || "") !== kitType) return false;
        if (season && (it.season || "") !== season) return false;
        if (!text) return true;
        return scoreItem(it, text) > 0;
      })
      .map((it) => ({ it, score: text ? scoreItem(it, text) : 0 }));

    const [field, dir = "asc"] = (sortParam || "").split(":");
    const asc = dir.toLowerCase() === "asc";
    withScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (field === "title") {
        return asc
          ? a.it.title.localeCompare(b.it.title)
          : b.it.title.localeCompare(a.it.title);
      }
      return 0;
    });
    return withScores.map((x) => x.it);
  }, [raw, dq, team, kitType, season, sortParam]);

  // Keep URL updated as filters/search change (so share/back/forward work)
  React.useEffect(() => {
    setSearchParam("q", q || null);
  }, [q]);
  React.useEffect(() => {
    setSearchParam("team", team || null);
  }, [team]);
  React.useEffect(() => {
    setSearchParam("kitType", kitType || null);
  }, [kitType]);
  React.useEffect(() => {
    setSearchParam("season", season || null);
  }, [season]);
  React.useEffect(() => {
    setSearchParam("sort", sortParam || null);
  }, [sortParam]);

  const styles = `
  :root{
    --ui-surface: rgba(255,255,255,0.06);
    --ui-surface-hover: rgba(255,255,255,0.10);
    --ui-border: rgba(255,255,255,0.12);
    --ui-border-strong: rgba(255,255,255,0.18);
    --ui-text-weak: rgba(255,255,255,0.65);
    --ui-focus: #00D0FF;
    --ui-shadow: 0 2px 10px rgba(0,0,0,.35);
    --ui-inset: inset 0 1px 0 rgba(255,255,255,.06);
  }

  @keyframes card-reveal { from {opacity:0; transform:translate3d(0,10px,0) scale(.985)} to {opacity:1; transform:none}}
  @keyframes shimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }

  .card-surface {
    background:
      radial-gradient(120% 140% at 50% -10%, rgba(255,255,255,.08), rgba(255,255,255,.02) 45%, rgba(255,255,255,0) 60%),
      linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
  }
  .vignette::after { content:""; position:absolute; inset:0; background:radial-gradient(70% 70% at 50% 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,.10) 100%) }
  .shine::before { content:""; position:absolute; inset:-1px;
    background:linear-gradient(115deg, rgba(255,255,255,0) 45%, rgba(255,255,255,.08) 50%, rgba(255,255,255,0) 55%);
    transform:translateX(-120%); transition:transform .85s cubic-bezier(.22,.61,.36,1) }
  .shine:hover::before { transform:translateX(120%) }
  .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }

  .pro-filters button,
  .pro-filters select,
  .pro-filters input {
    background-color: var(--ui-surface) !important;
    border: 1px solid var(--ui-border) !important;
    box-shadow: var(--ui-inset), var(--ui-shadow) !important;
    color: #fff !important;
  }
  .pro-filters button:hover,
  .pro-filters select:hover,
  .pro-filters input:hover { background-color: var(--ui-surface-hover) !important; }

  .pro-filters select:focus,
  .pro-filters input:focus,
  .pro-filters button:focus {
    outline: none !important;
    border-color: var(--ui-border-strong) !important;
    box-shadow:
      0 0 0 2px color-mix(in srgb, var(--ui-focus) 35%, transparent),
      var(--ui-inset),
      var(--ui-shadow) !important;
  }

  .select-reset { appearance: none; -webkit-appearance: none; -moz-appearance: none; background-image: none; }
  .select-reset::-ms-expand { display: none; }

  @media (prefers-reduced-motion: reduce) { [data-anim="reveal"] { animation:none !important } .shine::before { display:none } }
`;

  const activeCount =
    (team ? 1 : 0) + (kitType ? 1 : 0) + (season ? 1 : 0) + (q ? 1 : 0);

  const FilterRail = (
    <div className="sticky top-0 z-30 bg-neutral-950/85 backdrop-blur border-b border-white/10">
      <div className="mx-auto w-full max-w-[100vw] px-4">
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setOpenFilters(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06]
                       px-3.5 py-2 text-sm hover:bg-white/[0.1] active:scale-[.99]
                       shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_2px_10px_rgba(0,0,0,.35)]"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4 opacity-80" />
            <span className="opacity-90">Filters</span>
            {activeCount > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-black text-[10px] font-bold px-1">
                {activeCount}
              </span>
            )}
          </button>

          <label className="relative flex-1 min-w-[52%]">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              placeholder="Search products"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-full bg-white/[0.06] border border-white/10
                         pl-9 pr-9 py-2 text-sm outline-none focus:ring-2 ring-white/20
                         shadow-[inset_0_1px_0_rgba(255,255,255,.06)]"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/15 w-6 h-6 grid place-content-center"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </label>

          <InlineFacet
            label="Team"
            value={team}
            onChange={setTeam}
            options={facets.teams}
          />
          <InlineFacet
            label="Kit"
            value={kitType}
            onChange={setKitType}
            options={facets.kits}
          />

          <div className="relative hidden sm:inline-block">
            <select
              value={sortParam}
              onChange={(e) => setSortParam(e.target.value)}
              className="select-reset rounded-full bg-neutral-900/70 border border-white/15
                         pl-3 pr-9 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_2px_10px_rgba(0,0,0,.35)]
                         hover:bg-neutral-800/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-white/20"
            >
              <option value="title:asc">Name: A → Z</option>
              <option value="title:desc">Name: Z → A</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          </div>
        </div>

        {activeCount > 0 && (
          <div className="pb-2 -mt-1 flex flex-wrap gap-2">
            {team && (
              <Chip label={`Team: ${team}`} onClear={() => setTeam("")} />
            )}
            {kitType && (
              <Chip label={`Kit: ${kitType}`} onClear={() => setKitType("")} />
            )}
            {season && (
              <Chip label={`Season: ${season}`} onClear={() => setSeason("")} />
            )}
            {q && <Chip label={`Query: ${q}`} onClear={() => setQ("")} />}
          </div>
        )}
      </div>
    </div>
  );

  const MobileSheet = openFilters ? (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => setOpenFilters(false)}
      />
      <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-neutral-950 border-t border-white/10 p-4">
        <div className="mx-auto max-w-[100vw] px-1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              Filters
            </h2>
            <button
              onClick={() => setOpenFilters(false)}
              className="rounded-lg bg-white/10 px-3 py-1.5 hover:bg-white/15"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Facet
              label="Team"
              value={team}
              onChange={setTeam}
              options={facets.teams}
              placeholder="All Teams"
            />
            <Facet
              label="Kit"
              value={kitType}
              onChange={setKitType}
              options={facets.kits}
              placeholder="All Kits"
            />
            <Facet
              label="Season"
              value={season}
              onChange={setSeason}
              options={facets.seasons}
              placeholder="All Seasons"
            />
            <div>
              <div className="text-xs font-semibold tracking-wide text-white/50 mb-1.5">
                Sort
              </div>
              <div className="relative">
                <select
                  value={sortParam}
                  onChange={(e) => setSortParam(e.target.value)}
                  className="select-reset w-full rounded-xl bg-neutral-900/70 border border-white/15
                             pl-3 pr-9 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-white/20"
                >
                  <option value="title:asc">Name: A → Z</option>
                  <option value="title:desc">Name: Z → A</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className="bg-neutral-950 text-white min-h-screen w-full overflow-x-hidden">
      <Header />
      <main className="w-full">
        <style>{styles}</style>

        {FilterRail}
        {MobileSheet}

        {/* Grid */}
        <div className="mx-auto w-full max-w-[100vw] px-4">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 xl:grid-cols-4 pb-10 pt-2">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : filtered.map((it, i) => (
                  <Card key={it.id} item={it} index={i} />
                ))}
          </div>

          {!loading && !err && filtered.length === 0 && (
            <div className="mt-10 pb-16 text-white/70">
              No products match your filters.
            </div>
          )}
          {err && (
            <div className="mt-10 pb-16 text-red-400">
              Failed to load products: {err}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function InlineFacet({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="hidden sm:flex items-center">
      <span className="mr-2 text-white/60 text-sm">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select-reset rounded-full bg-neutral-900/70 border border-white/15 text-sm
                     pl-3 pr-9 py-2 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_2px_10px_rgba(0,0,0,.35)]
                     hover:bg-neutral-800/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-white/20"
        >
          <option value="">All</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
      </div>
    </div>
  );
}

function Facet({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold tracking-wide text-white/50 mb-1.5">
        {label}
      </div>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select-reset w-full rounded-xl bg-neutral-900/70 border border-white/15
                     pl-3 pr-9 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-white/20"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
      </div>
    </div>
  );
}

/* ================== Chip ================== */
function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[12px]
                     shadow-[inset_0_1px_0_rgba(255,255,255,.06)]"
    >
      {label}
      <button
        onClick={onClear}
        className="rounded-full w-5 h-5 inline-grid place-content-center bg-white/10 hover:bg-white/15"
        aria-label="Clear filter"
        title="Clear"
      >
        ×
      </button>
    </span>
  );
}

/* ================== Card ================== */
function Card({ item, index }: { item: FeaturedItem; index: number }) {
  // ====== State & Refs ======
  const [active, setActive] = React.useState(0);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const images = item.images.length ? item.images : [footballTshirt];
  const [srcs, setSrcs] = React.useState<string[]>(images);
  const hoverTimer = React.useRef<number | null>(null);
  const { ref, shown } = useReveal<HTMLDivElement>();
  const len = Math.max(1, srcs.length);

  // ====== Effects ======
  // Update srcs if images change
  React.useEffect(() => setSrcs(images), [images]);

  // ====== Carousel Controls ======
  const slideTo = (i: number) => {
    setActive(i);
    if (trackRef.current) {
      trackRef.current.style.transition = "transform 520ms cubic-bezier(.4,0,.2,1)";
      trackRef.current.style.transform = `translate3d(${-i * 100}%,0,0)`;
    }
  };

  const startCycle = () => {
    if (len <= 1 || hoverTimer.current) return;
    hoverTimer.current = window.setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % len;
        if (trackRef.current) {
          trackRef.current.style.transition = "transform 480ms cubic-bezier(.4,0,.2,1)";
          trackRef.current.style.transform = `translate3d(${-next * 100}%,0,0)`;
        }
        return next;
      });
    }, 1400);
  };

  const stopCycle = () => {
    if (hoverTimer.current) {
      window.clearInterval(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  // ====== Image Error Handling ======
  const onImgError = (idx: number) => (e: React.SyntheticEvent<HTMLImageElement>) => {
    const src = e.currentTarget.src;
    const extensions = [".jpg", ".jpeg", ".png", ".webp"];
    const currentExtMatch = src.match(/\.([a-z]{3,4})($|\?)/i);
    const currentExt = currentExtMatch ? currentExtMatch[1] : null;

    setSrcs((prev) => {
      const next = [...prev];
      const baseSrc = src.replace(/\.[a-z]{3,4}($|\?.*)/i, "");

      if (currentExt) {
        const currentIndex = extensions.findIndex(
          (ext) => ext.replace(".", "") === currentExt.toLowerCase()
        );
        const nextIndex = (currentIndex + 1) % extensions.length;
        next[idx] = baseSrc + extensions[nextIndex];
      } else {
        next[idx] = src + ".jpg";
      }

      const allTried = extensions.every((ext) =>
        prev.some((p) => p.includes(baseSrc + ext))
      );
      if (allTried) next[idx] = footballTshirt;

      return next;
    });
  };

  // ====== Render ======
  return (
    <article
      ref={ref}
      data-anim="reveal"
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
      style={{
        animation: shown ? "card-reveal .5s both" : undefined,
        animationDelay: `${(index % 10) * 28}ms`,
      }}
      className="shine relative overflow-hidden rounded-2xl border border-white/10 card-surface
                 shadow-[0_8px_38px_rgba(0,0,0,0.45)] transition duration-300
                 hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(0,0,0,0.55)] hover:border-white/20"
    >
      {/* ====== Image Carousel ====== */}
      <div className="relative aspect-[4/5] overflow-hidden vignette">
        <div
          ref={trackRef}
          className="absolute inset-0 flex"
          style={{ transform: `translate3d(${-active * 100}%,0,0)`, transition: "none", willChange: "transform" }}
        >
          {srcs.map((src, i) => (
            <div key={i} className="relative shrink-0 w-full h-full">
              <img
                src={src}
                alt={`${item.title} ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
                decoding="async"
                onError={onImgError(i)}
              />
            </div>
          ))}
        </div>

        {/* Badge / Kit Type */}
        {(item.kitType || item.badge) && (
          <span className="absolute left-2.5 top-2.5 z-20 rounded-full bg-white text-black text-[10px] font-semibold px-2 py-0.5 shadow">
            {item.kitType || item.badge}
          </span>
        )}
      </div>

      {/* ====== Card Content ====== */}
      <div className="p-2.5 sm:p-3">
        {/* Title + Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug text-[0.95rem] md:text-base line-clamp-2">
            {item.title}
          </h3>

          {/* Old/New Price */}
          <div className="flex flex-col items-end">
            {item.oldPrice && (
              <span className="text-xs line-through text-white/50">{item.oldPrice}</span>
            )}
            <span className="text-sm font-bold">{item.price}</span>
          </div>
        </div>

        {/* Team / Season */}
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-white/60">
          <span className="truncate">{item.team ?? "—"}</span>
          <span className="truncate">{item.season ?? ""}</span>
        </div>

        {/* Image indicators */}
        {len > 1 && (
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {srcs.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  slideTo(i);
                }}
                className={
                  "h-2.5 w-2.5 rounded-full ring-1 ring-white/30 transition-all " +
                  (i === active
                    ? "bg-white/90 scale-110"
                    : "bg-white/35 hover:bg-white/60")
                }
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-white/10 card-surface shadow-[0_8px_38px_rgba(0,0,0,0.45)]">
      <div className="aspect-[4/5] bg-white/5" />
      <div className="p-2.5 sm:p-3 space-y-1.5">
        <div className="h-4 w-3/4 bg-white/10 rounded" />
        <div className="h-4 w-1/4 bg-white/10 rounded" />
        <div className="flex justify-between text-[11px] text-white/20">
          <span className="h-3 w-1/3 bg-white/10 rounded" />
          <span className="h-3 w-1/4 bg-white/10 rounded" />
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="h-2.5 w-2.5 rounded-full bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
