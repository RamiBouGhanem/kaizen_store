// src/components/ScrollReveal.tsx
import { useEffect, useRef, useState, type ElementType, type ComponentPropsWithoutRef, type ReactNode } from "react";

type Variant = "fade-up" | "fade-in" | "slide-left" | "slide-right";

type ScrollRevealBaseProps = {
  className?: string;
  variant?: Variant;
  delay?: number;      // ms
  threshold?: number;  // intersection threshold
  once?: boolean;      // reveal only once
  children: ReactNode;
};

// Polymorphic props: allow `as` to be any intrinsic or component type
export type ScrollRevealProps<T extends ElementType = "div"> = ScrollRevealBaseProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "ref">;

export default function ScrollReveal<T extends ElementType = "div">({
  as,
  className = "",
  variant = "fade-up",
  delay = 0,
  threshold = 0.15,
  once = true,
  children,
  ...rest
}: ScrollRevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;

  // HTMLElement is fine for all intrinsic tags; for custom components the ref is ignored
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Guard for SSR or very old browsers
    if (typeof window === "undefined" || typeof document === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      // Use a callback ref to coerce to HTMLElement safely
      ref={(node: unknown) => {
        ref.current = (node as HTMLElement) ?? null;
      }}
      data-visible={visible ? "true" : "false"}
      className={`sr sr--${variant} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...(rest as object)}
    >
      {children}
    </Tag>
  );
}
