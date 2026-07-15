import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

// Copy final — SPEC.md §2.3 (ordem literal, sem logos de terceiros).
const PARCEIROS = [
  "CIS BRASIL",
  "ABZ GROUP",
  "GRAN SERVICES",
  "HEFTOS",
  "RIP",
  "ESTRUTURAL",
  "MANSERV",
  "SSE",
  "ENGEMAN",
  "ACTEMIUM",
  "TECHOCEAN",
  "OES",
];

const FADE_MASK =
  "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)";

function MarqueeRow({ reversed = false, reduced }: { reversed?: boolean; reduced: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<ReturnType<typeof gsap.to> | null>(null);

  useEffect(() => {
    if (reduced || !trackRef.current) return;

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.fromTo(
        trackRef.current,
        { xPercent: reversed ? -50 : 0 },
        {
          xPercent: reversed ? 0 : -50,
          duration: 32,
          ease: "none",
          repeat: -1,
        },
      );
    }, trackRef);

    return () => ctx.revert();
  }, [reduced, reversed]);

  if (reduced) {
    return (
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 px-4">
        {PARCEIROS.map((nome) => (
          <span key={nome} className="font-display text-lg text-fg-muted sm:text-xl">
            {nome}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden"
      style={{ WebkitMaskImage: FADE_MASK, maskImage: FADE_MASK }}
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.resume()}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map((dup) => (
          <div
            key={dup}
            className="flex shrink-0 items-center gap-x-10 pr-10"
            aria-hidden={dup === 1}
          >
            {PARCEIROS.map((nome) => (
              <span
                key={nome}
                className="flex items-center gap-x-10 font-display text-lg text-fg-muted transition-colors duration-200 hover:text-fg sm:text-2xl md:text-3xl"
              >
                {nome}
                <span className="text-graphite" aria-hidden="true">
                  ·
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProvaSocial() {
  // ponytail: leitura síncrona no mount (CSR-only) evita flash de motion antes do reduced-motion aplicar.
  const [reduced] = useState(() => prefersReducedMotion());

  return (
    <section id="prova-social" className="border-y border-border bg-bg py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="label-mono">Operação real, parceiros reais</p>
          <p className="font-mono text-sm text-fg-muted sm:text-base">
            Presentes na cadeia offshore da Bacia de Campos
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-6 sm:mt-12">
        <MarqueeRow reduced={reduced} />
        <MarqueeRow reduced={reduced} reversed />
      </div>

      <p className="mt-10 text-center font-mono text-xs text-fg-muted/70 sm:mt-12">
        Parceiros e clientes citados no portfólio da BMF.
      </p>
    </section>
  );
}
