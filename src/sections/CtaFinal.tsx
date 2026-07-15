import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

export default function CtaFinal() {
  const glowRef = useRef<HTMLDivElement>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || !glowRef.current) {
      if (glowRef.current) gsap.set(glowRef.current, { opacity: 0.2 });
      return;
    }
    const tween = gsap.to(glowRef.current, {
      opacity: 0.25,
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <section id="contato" className="relative overflow-hidden bg-bg py-28 sm:py-36">
      {/* fundo: imagem escurecida com degradação para gradiente caso o asset falhe */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-surface-2 to-bg" />
      {!imgFailed && (
        <img
          src="/img/embarcacao.jpg"
          alt=""
          aria-hidden
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 size-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-bg/70" />

      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[60rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.15]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-red-deep) 55%, transparent), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="label-mono">Atendimento dedicado ao setor offshore</p>
        <h2 className="mt-5 font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-fg">
          Vamos colocar sua operação sob controle.
        </h2>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.a
            href="#contato"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full bg-red px-6 py-3.5 text-sm font-medium text-fg"
          >
            Falar com um especialista
            <ArrowRight className="size-4" aria-hidden />
          </motion.a>
          <motion.a
            href="#mio"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-fg"
          >
            Conhecer o MiO
          </motion.a>
        </div>

        <p className="label-mono mt-8">
          Atendimento dedicado ao setor offshore em Rio das Ostras / Macaé.
        </p>
      </div>
    </section>
  );
}
