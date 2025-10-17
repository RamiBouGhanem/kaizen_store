// src/components/ScrollEffects.tsx
import { useEffect } from "react";

/**
 * ScrollEffects
 * - Reveal-on-enter with stagger + per-element duration override (data-duration)
 * - Continuous in-view toggling for sections with [data-observe] (adds/removes .in-view)
 * - Smooth parallax for elements with .parallax (data-speed)
 * - Honors prefers-reduced-motion
 */
export default function ScrollEffects() {
  useEffect(() => {
    // Guard for SSR / non-browser environments
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const prefersReduced =
      !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // ---------- REVEAL: set stagger + optional per-element duration ----------
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const containerMap = new Map<HTMLElement, HTMLElement[]>(); // parent -> children

    // group children by [data-stagger] parent
    revealEls.forEach((el) => {
      const parent = el.closest("[data-stagger]") as HTMLElement | null;
      if (parent) {
        const arr = containerMap.get(parent) ?? [];
        arr.push(el);
        containerMap.set(parent, arr);
      }
    });

    // assign stagger delays within each container
    containerMap.forEach((children, parent) => {
      const step = Number(parent.getAttribute("data-stagger")) || 120; // ms (slower)
      children.forEach((child, i) => {
        if (!child.style.getPropertyValue("--reveal-delay")) {
          child.style.setProperty("--reveal-delay", `${i * step}ms`);
        }
      });
    });

    // optional per-element delay + duration
    revealEls.forEach((el) => {
      const customDelay = el.getAttribute("data-delay");
      if (customDelay) el.style.setProperty("--reveal-delay", customDelay);

      const customDur = el.getAttribute("data-duration");
      if (customDur) el.style.setProperty("--reveal-duration", customDur);
    });

    // Create observers with explicit null-able types to avoid union with boolean
    let revealObserver: IntersectionObserver | null = null;

    if (!prefersReduced && "IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              // Defer to next frame for smoother CSS transition application
              requestAnimationFrame(() => el.classList.add("is-visible"));
              obs.unobserve(el); // reveal once
            }
          });
        },
        {
          root: null,
          threshold: 0.16,
          rootMargin: "0px 0px -6% 0px",
        }
      );
    }

    if (revealObserver) {
      revealEls.forEach((el) => revealObserver!.observe(el));
    } else {
      // Fallback: instantly visible
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }

    // ---------- OBSERVE: section state toggling (e.g., Featured) ----------
    const observed = Array.from(
      document.querySelectorAll<HTMLElement>("[data-observe]")
    );

    let sectionObserver: IntersectionObserver | null = null;

    if (!prefersReduced && "IntersectionObserver" in window) {
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) el.classList.add("in-view");
            else el.classList.remove("in-view");
          });
        },
        {
          root: null,
          threshold: 0.35,
          rootMargin: "0px 0px -5% 0px",
        }
      );
    }

    if (sectionObserver) {
      observed.forEach((el) => sectionObserver!.observe(el));
    } else {
      // Fallback: mark as in-view
      observed.forEach((el) => el.classList.add("in-view"));
    }

    // ---------- PARALLAX ----------
    const parallaxes = Array.from(document.querySelectorAll<HTMLElement>(".parallax"));
    let raf: number | null = null;

    const onScroll = () => {
      if (raf !== null) return;
      raf = window.requestAnimationFrame(() => {
        const winH = window.innerHeight;
        const scrollTop = window.scrollY;

        parallaxes.forEach((el) => {
          const speed = Number(el.getAttribute("data-speed")) || 0.18;
          const rect = el.getBoundingClientRect();
          const elTop = rect.top + scrollTop;
          const progress = (scrollTop + winH - elTop) / (winH + rect.height);
          const clamped = Math.max(0, Math.min(1, progress));
          const delta = (clamped - 0.5) * (speed * 240); // px
          el.style.setProperty("--pY", `${delta.toFixed(2)}px`);
        });

        raf = null;
      });
    };

    if (!prefersReduced) {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }

    // Cleanup
    return () => {
      if (revealObserver) revealObserver.disconnect();
      if (sectionObserver) sectionObserver.disconnect();
      if (!prefersReduced) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (raf !== null) window.cancelAnimationFrame(raf);
      }
    };
  }, []);

  return null;
}
