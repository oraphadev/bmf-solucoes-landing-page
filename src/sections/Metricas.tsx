import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { useReveal } from "../lib/anim";

type Metric = {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  source: string;
  hero?: boolean;
};

// Copy final — SPEC.md §2.7 (somente números do DISCOVERY, rótulo de origem honesto).
const METRICAS: Metric[] = [
  { target: 2016, label: "Ano de fundação", source: "Início da operação (CNPJ 2017)" },
  { target: 3, label: "Produtos no Ecossistema MiO", source: "MiO · MiO4u · eMiO" },
  { target: 126, label: "Usuários no 1º mês do MiO4u", source: "Fevereiro de 2025" },
  {
    target: 3.5,
    decimals: 1,
    suffix: "%",
    label: "Recuperação média do valor do contrato",
    source: "Análise de Passivo de Medição · dado BMF",
    hero: true,
  },
  {
    target: 60,
    label: "Meses de folha revisados",
    source: "Recuperação de créditos previdenciários",
  },
  {
    target: 1,
    prefix: "~",
    suffix: " mês",
    label: "Prazo de análise (antes: até 8 meses)",
    source: "Análise de Passivo de Medição · dado BMF",
  },
];

function formatValue(value: number, decimals = 0) {
  return decimals ? value.toFixed(decimals).replace(".", ",") : Math.round(value).toString();
}

function MetricCard({ metric, reduced }: { metric: Metric; reduced: boolean }) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const finalText = `${metric.prefix ?? ""}${formatValue(metric.target, metric.decimals)}${metric.suffix ?? ""}`;

  useEffect(() => {
    if (reduced || !numberRef.current) return;
    const el = numberRef.current;
    const proxy = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        value: metric.target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = `${metric.prefix ?? ""}${formatValue(proxy.value, metric.decimals)}${metric.suffix ?? ""}`;
        },
        onComplete: () => {
          el.textContent = finalText;
        },
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div data-metric-card className="flex flex-col gap-4 border-t border-l border-border px-6 py-10 sm:px-8">
      <span
        ref={numberRef}
        className={`font-mono leading-none tabular-nums ${
          metric.hero
            ? "text-[clamp(3.25rem,10vw,7.5rem)] text-red"
            : "text-[clamp(2.5rem,7vw,6.5rem)] text-fg"
        }`}
      >
        {finalText}
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-display text-base text-fg sm:text-lg">{metric.label}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted">
          {metric.source}
        </p>
      </div>
    </div>
  );
}

export default function Metricas() {
  // ponytail: leitura síncrona no mount (CSR-only) evita flash de motion antes do reduced-motion aplicar.
  const [reduced] = useState(() => prefersReducedMotion());
  useReveal("[data-metric-card]", { y: 20, stagger: 0.05 });

  return (
    <section id="metricas" className="bg-bg py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col gap-4 sm:mb-20">
          <p className="label-mono">Números da BMF</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.015em] text-fg">
            O que a tecnologia já entrega.
          </h2>
        </div>

        <div className="grid grid-cols-1 border-r border-b border-border sm:grid-cols-2 lg:grid-cols-3">
          {METRICAS.map((metric) => (
            <MetricCard key={metric.label} metric={metric} reduced={reduced} />
          ))}
        </div>

        <p className="mt-10 font-mono text-xs text-fg-muted/70">
          Métricas informadas pela BMF; recuperações não auditadas por terceiros.
        </p>
      </div>
    </section>
  );
}
