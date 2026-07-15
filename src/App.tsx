import { useLayoutEffect } from "react";
import {
  ScrollSmoother,
  ScrollTrigger,
  prefersReducedMotion,
} from "./lib/gsap";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import ProvaSocial from "./sections/ProvaSocial";
import Ecossistema from "./sections/Ecossistema";
import BentoMio from "./sections/BentoMio";
import ProdutoEmAcao from "./sections/ProdutoEmAcao";
import Metricas from "./sections/Metricas";
import Creditos from "./sections/Creditos";
import Faq from "./sections/Faq";
import CtaFinal from "./sections/CtaFinal";
import Footer from "./sections/Footer";

// Offset (px) para alinhar âncoras abaixo da Nav fixa.
const NAV_OFFSET = 84;

function App() {
  // ScrollSmoother envolve o conteúdo (Nav fica fora). Ativo também em touch
  // (smoothTouch leve). Desligado só em reduced-motion, onde o scroll nativo +
  // scroll-padding-top (index.css) cuidam das âncoras. Sem normalizeScroll:
  // ele atrapalha o momentum do trackpad no macOS e deixa o scroll atrasado.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2,
      effects: true,
      smoothTouch: 0.1,
    });
    // Reconcilia triggers criados pelas seções (efeitos filhos rodam antes
    // deste efeito do App) com o pinType/offset do smoother.
    ScrollTrigger.refresh();

    // Âncoras via smoother: sob smoothing o salto nativo de #hash não funciona.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element)?.closest?.<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      const href = anchor?.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      smoother.scrollTo(target, true, `top ${NAV_OFFSET}px`);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      smoother.kill();
    };
  }, []);

  return (
    <>
      <Nav />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Hero />
          <ProvaSocial />
          <Ecossistema />
          <BentoMio />
          <ProdutoEmAcao />
          <Metricas />
          <Creditos />
          <Faq />
          <CtaFinal />
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
