import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ShieldCheck,
  Clock,
  CalendarRange,
  LayoutDashboard,
  Users,
} from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { EASE_BRAND } from "../lib/anim";

/** Move o spotlight radial acompanhando o cursor via CSS vars no próprio card. */
function handleSpotlight(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
  el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
}

/** Mini-visual do card grande: linha do tempo embarque → desembarque (decorativo). */
function EmbarkTimeline() {
  return (
    <div aria-hidden className="mt-8">
      <div className="relative flex items-center justify-between">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-red shadow-[0_0_12px_1px_rgba(241,77,65,0.5)]" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-graphite" />
        <span className="relative h-1.5 w-1.5 rounded-full bg-graphite" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-blue shadow-[0_0_12px_1px_rgba(89,124,255,0.5)]" />
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-fg-muted">
        <span>Embarque · 06:00</span>
        <span>Desembarque · 18:20</span>
      </div>
    </div>
  );
}

/** Mini sparkline SVG animada (draw via CSS) para o card de dashboards. */
function Sparkline() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 36"
      preserveAspectRatio="none"
      className="mt-5 h-9 w-full overflow-visible"
    >
      <polyline
        className="bento-spark"
        points="0,28 18,22 34,26 52,12 70,18 88,6 106,14 120,4"
        fill="none"
        stroke="var(--color-blue)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={120} cy={4} r={2.5} fill="var(--color-blue)" />
    </svg>
  );
}

type Card = {
  key: string;
  label: string;
  title: string;
  desc: string;
  icon?: ReactNode;
  span: string;
  visual?: ReactNode;
  big?: boolean;
};

const ICON = "h-5 w-5 text-red";

const CARDS: Card[] = [
  {
    key: "logistica",
    label: "Módulo central",
    title: "Logística de pessoal offshore",
    desc: "Embarques, desembarques, escalas, folgas e dobras em um painel único, com histórico rastreável.",
    span: "md:col-span-7 md:row-span-2",
    big: true,
    visual: <EmbarkTimeline />,
  },
  {
    key: "aso",
    label: "Conformidade",
    title: "ASO e conformidade",
    desc: "Alertas automáticos de vencimento de ASO, treinamentos e documentação obrigatória.",
    icon: <ShieldCheck className={ICON} />,
    span: "md:col-span-5",
  },
  {
    key: "timesheet",
    label: "Apontamento",
    title: "Timesheet",
    desc: "Apontamento de horas e registros operacionais integrados à folha.",
    icon: <Clock className={ICON} />,
    span: "md:col-span-5",
  },
  {
    key: "obras",
    label: "Projetos",
    title: "Planejamento de obras",
    desc: "Cronogramas, orçamento, etapas e documentos por projeto.",
    icon: <CalendarRange className={ICON} />,
    span: "md:col-span-4",
  },
  {
    key: "dashboards",
    label: "Analytics",
    title: "Dashboards em tempo real",
    desc: "KPIs e relatórios analíticos, com integração Power BI.",
    icon: <LayoutDashboard className={ICON} />,
    span: "md:col-span-4",
    visual: <Sparkline />,
  },
  {
    key: "multiusuario",
    label: "Acesso",
    title: "Multiusuário por perfil",
    desc: "Acesso com permissões por função e login Google ou Microsoft.",
    icon: <Users className={ICON} />,
    span: "md:col-span-4",
  },
];

export default function BentoMio() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Entrada dos cards com stagger via ScrollTrigger batch.
  useEffect(() => {
    if (prefersReducedMotion() || !gridRef.current) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".bento-item");
      gsap.set(items, { opacity: 0, y: 24 });
      ScrollTrigger.batch(items, {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: EASE_BRAND,
            stagger: 0.04,
            overwrite: true,
          }),
      });
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="bento-mio" className="bg-bg px-5 py-24 sm:px-8 md:py-32">
      <style>{`
        .bento-spark {
          stroke-dasharray: 260;
          stroke-dashoffset: 260;
          animation: bento-draw 2.4s var(--ease-brand) forwards;
        }
        @keyframes bento-draw { to { stroke-dashoffset: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .bento-spark { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="label-mono">Dentro do MiO</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em]">
            Arquitetura modular. Contrate o que a operação precisa.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">
            Cada módulo resolve uma dor concreta da operação offshore e
            conversa com todos os outros.
          </p>
        </header>

        <div
          ref={gridRef}
          className="mt-12 grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-12"
        >
          {CARDS.map((card) => (
            <div key={card.key} className={`bento-item ${card.span}`}>
              <motion.article
                onMouseMove={handleSpotlight}
                whileHover={reduce ? undefined : { scale: 1.01 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-[20px] border border-border bg-surface p-6 transition-colors duration-200 hover:border-white/20 sm:p-7"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(320px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(241,77,65,0.10), transparent 70%)",
                  }}
                />

                {card.big && (
                  <>
                    <img
                      src="/img/hero-plataforma.jpg"
                      alt="Painel do MiO exibindo logística de pessoal offshore"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-surface/85 to-surface/40"
                    />
                  </>
                )}

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    {card.icon}
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
                      {card.label}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[clamp(1.25rem,2vw,1.75rem)] leading-tight">
                    {card.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
                    {card.desc}
                  </p>
                  {card.visual && <div className="mt-auto">{card.visual}</div>}
                </div>
              </motion.article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
