import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

// Registro único dos plugins GSAP gratuitos usados no projeto.
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };
