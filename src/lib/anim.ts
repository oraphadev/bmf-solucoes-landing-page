import { useEffect } from "react";
import type { Variants } from "motion/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

export const EASE_BRAND = "cubic-bezier(0.16, 1, 0.3, 1)" as const;
export const DURATION_ENTER = 0.6;
export const DURATION_EXIT = DURATION_ENTER * 0.65;
export const STAGGER = 0.04;

/** Reveal fade+y com stagger via ScrollTrigger para uma lista de elementos. */
export function useReveal(
  selector: string,
  opts: { y?: number; stagger?: number; start?: string } = {},
) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { y = 24, stagger = STAGGER, start = "top 85%" } = opts;
    const targets = gsap.utils.toArray<HTMLElement>(selector);
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      targets.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: DURATION_ENTER,
            ease: EASE_BRAND,
            stagger,
            scrollTrigger: { trigger: el, start },
          },
        );
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector]);
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_ENTER, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: 12,
    transition: { duration: DURATION_EXIT, ease: [0.16, 1, 0.3, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION_ENTER, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: DURATION_EXIT, ease: [0.16, 1, 0.3, 1] },
  },
};

export { ScrollTrigger };
