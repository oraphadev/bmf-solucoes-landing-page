import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  prefersReducedMotion,
} from "../lib/gsap";
import { EASE_BRAND } from "../lib/anim";

const STATUS_CHIPS = [
  "Ecossistema MiO",
  "MiO4u",
  "eMiO",
  "Recuperação de créditos",
] as const;

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const [mediaFailed, setMediaFailed] = useState({ video: false, image: false });
  const reduced = prefersReducedMotion();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;

    const ctx = gsap.context((self) => {
      const q = self.selector!;
      // Estado inicial oculto imediato (evita flash antes do reveal).
      gsap.set(q("[data-reveal]"), { opacity: 0, y: 20 });
      if (h1Ref.current) gsap.set(h1Ref.current, { autoAlpha: 0 });

      // Parallax do fundo — só transform, scrub ao longo do hero.
      if (mediaRef.current) {
        gsap.to(mediaRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Reveal do H1 por linhas mascaradas, após as fontes carregarem
      // (SplitText precisa das métricas corretas para quebrar linhas).
      let split: SplitText | null = null;
      document.fonts.ready.then(() => {
        if (!h1Ref.current) return;
        ctx.add(() => {
          split = SplitText.create(h1Ref.current, {
            type: "lines",
            mask: "lines",
            linesClass: "hero-line",
          });
          gsap.set(h1Ref.current, { autoAlpha: 1 });

          const tl = gsap.timeline({ delay: 0.15 });
          tl.from(split.lines, {
            yPercent: 110,
            duration: 0.8,
            stagger: 0.06,
            ease: EASE_BRAND,
          });
          tl.to(
            q("[data-reveal]"),
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.05,
              ease: EASE_BRAND,
            },
            "-=0.45",
          );
        });
      });

      return () => split?.revert();
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [reduced]);

  const showVideo = !mediaFailed.video;
  const showImage = mediaFailed.video && !mediaFailed.image;

  return (
    <section
      ref={rootRef}
      id="topo"
      className="relative flex min-h-dvh flex-col overflow-hidden bg-bg"
    >
      {/* Fundo — parallax: gradiente base sempre presente; imagem e vídeo degradam sem quebrar */}
      <div
        ref={mediaRef}
        className="pointer-events-none absolute inset-0 scale-[1.12] bg-gradient-to-b from-surface-2 to-bg"
        aria-hidden="true"
      >
        {showImage && (
          <img
            src="/img/hero-plataforma.jpg"
            alt=""
            className="h-full w-full object-cover"
            onError={() => setMediaFailed((s) => ({ ...s, image: true }))}
          />
        )}
        {showVideo && (
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="/img/hero-plataforma.jpg"
            aria-label="Plataforma offshore em operação ao entardecer na Bacia de Campos"
            onError={() => setMediaFailed((s) => ({ ...s, video: true }))}
          >
            <source src="/video/hero-loop.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      {/* Overlays de contraste: escurecimento radial das bordas + vinheta para --bg na base */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 15%, transparent 25%, rgba(9,9,9,0.55) 70%, rgba(9,9,9,0.9) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(9,9,9,0.7) 55%, #090909 100%)",
        }}
        aria-hidden="true"
      />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 pt-28 pb-40 sm:px-8">
        <p data-reveal className="label-mono">
          BMF Soluções · Rio das Ostras / Macaé
        </p>

        <h1
          ref={h1Ref}
          className="mt-6 max-w-4xl font-display leading-[0.95] tracking-[-0.02em] text-fg"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
        >
          Sua operação offshore, sob controle.
        </h1>

        <p
          data-reveal
          className="mt-8 font-display text-xl tracking-[-0.01em] text-fg sm:text-2xl"
        >
          Tecnologia inteligente para operações eficientes.
        </p>

        <p
          data-reveal
          className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg"
        >
          O Ecossistema MiO conecta pessoas, escalas, documentação e berços
          portuários em um único ambiente. Feito para quem opera na Bacia de
          Campos e não pode parar.
        </p>

        <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <motion.a
            href="#contato"
            whileHover={reduced ? undefined : { scale: 1.03 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-red px-7 text-sm font-medium text-fg shadow-[0_0_32px_-8px_rgba(241,77,65,0.6)]"
          >
            Falar com um especialista
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </motion.a>
          <motion.a
            href="#mio"
            whileHover={reduced ? undefined : { scale: 1.03 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-border px-7 text-sm font-medium text-fg backdrop-blur-sm hover:border-white/20"
          >
            Conhecer o MiO
          </motion.a>
        </div>
      </div>

      {/* Régua de status estilo sala de controle */}
      <div
        data-reveal
        className="relative z-10 border-t border-border bg-bg/40 backdrop-blur-sm"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3.5 sm:px-8">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex size-2">
              {!reduced && (
                <motion.span
                  className="absolute inline-flex size-full rounded-full bg-red"
                  animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <span className="relative inline-flex size-2 rounded-full bg-red" />
            </span>
            <span className="label-mono !text-[0.7rem] text-fg">
              Sistemas online
            </span>
          </span>
          {STATUS_CHIPS.map((chip) => (
            <span
              key={chip}
              className="label-mono !text-[0.7rem] before:mr-5 before:text-graphite before:content-['/'] first:before:hidden"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Indicador de scroll discreto */}
      {!reduced && (
        <motion.div
          className="pointer-events-none absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-border p-1">
            <motion.span
              className="size-1 rounded-full bg-fg-muted"
              animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
