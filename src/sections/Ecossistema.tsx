import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Bell,
  CalendarClock,
  Check,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../lib/gsap";

// ---------------------------------------------------------------------------
// Conteúdo (copy literal do SPEC 2.4). Visual do MiO4u = mock mobile em CSS.
// ---------------------------------------------------------------------------
type Accent = "red" | "blue";
type Media =
  | { kind: "image"; src: string; alt: string; badge?: string }
  | { kind: "mock" };

interface Stage {
  id: string;
  num: string;
  short: string;
  label: string;
  title: string;
  body: string;
  bullets: string[];
  accent: Accent;
  media: Media;
}

const STAGES: Stage[] = [
  {
    id: "mio",
    num: "01",
    short: "MiO",
    label: "MiO · PLATAFORMA DE GESTÃO OPERACIONAL",
    title: "O centro de comando da operação.",
    body: "Planejamento, execução, logística de pessoal, qualidade, SMS e documentação em um só ambiente. Escalas, folgas, dobras, embarques e desembarques com alertas automáticos de vencimento de ASO e treinamento.",
    bullets: [
      "Logística de pessoal offshore (embarque, desembarque, escala, dobra)",
      "Controle de ASO, treinamentos e documentação obrigatória",
      "Dashboards gerenciais em tempo real e integração com Power BI e ERPs",
      "Hospedagem em Microsoft Azure · bilíngue PT/EN",
    ],
    accent: "red",
    media: {
      kind: "image",
      src: "/img/helideck.jpg",
      alt: "Helideck de plataforma offshore com helicóptero em aproximação",
    },
  },
  {
    id: "mio4u",
    num: "02",
    short: "MiO4u",
    label: "MiO4u · APP DO COLABORADOR",
    title: "A operação no bolso de quem embarca.",
    body: "Portal exclusivo do colaborador, sincronizado em tempo real com o MiO. ASO, treinamentos, certificados e escala na palma da mão, com notificações de exames pendentes e mudanças na logística.",
    bullets: [
      "ASO, treinamentos e certificados sempre à mão",
      "Notificações de pendências e mudanças de escala",
      "Ponto/timesheet e Gestor de Chamados",
      "PWA · português, inglês e espanhol · modo claro e escuro",
    ],
    accent: "blue",
    media: { kind: "mock" },
  },
  {
    id: "emio",
    num: "03",
    short: "eMiO",
    label: "eMiO · GESTÃO DE BERÇOS PORTUÁRIOS",
    title: "O berço certo, na hora certa.",
    body: "Gestão de reservas e ocupação de berços portuários com calendário operacional inteligente, monitoramento em tempo real e alertas automáticos. Em operação no Porto do Açu.",
    bullets: [
      "Calendário operacional inteligente de berços",
      "Monitoramento em tempo real e alertas automáticos",
      "Indicadores de gestão e agendamento integrado",
      "Em operação no Porto do Açu (consórcio DOME · Gran Services + Prumo Logística)",
    ],
    accent: "red",
    media: {
      kind: "image",
      src: "/img/porto.jpg",
      alt: "Berço portuário com embarcação atracada no Porto do Açu",
      badge: "DOME · PORTO DO AÇU",
    },
  },
];

// Posição (em vh) de cada âncora #mio/#mio4u/#emio dentro do wrapper de 360vh.
// Como o pin percorre 260vh (360vh - 100vh de viewport), estes valores mapeiam
// para o progresso 0 / 0.5 / 1, os centros de snap dos três estágios.
const ANCHOR_VH = [0, 130, 260];

const accentVar = (a: Accent) =>
  a === "blue" ? "var(--color-blue)" : "var(--color-red)";

// ---------------------------------------------------------------------------
// Detecta se devemos degradar para blocos empilhados estáticos:
// prefers-reduced-motion OU viewport < 768px.
// ---------------------------------------------------------------------------
function useStaticLayout(): boolean {
  const query = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(max-width: 767px)").matches;
  const [isStatic, setStatic] = useState(query);
  useEffect(() => {
    const mqs = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(max-width: 767px)"),
    ];
    const update = () => setStatic(query());
    mqs.forEach((m) => m.addEventListener("change", update));
    return () => mqs.forEach((m) => m.removeEventListener("change", update));
  }, []);
  return isStatic;
}

// ---------------------------------------------------------------------------
// Mídia com fallback: <img> que degrada para gradiente escuro em onError.
// ---------------------------------------------------------------------------
function StageImage({
  src,
  alt,
  badge,
}: {
  src: string;
  alt: string;
  badge?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg to-surface-2">
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="stage-media h-full w-full object-cover"
        />
      ) : (
        <span className="sr-only">{alt}</span>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/10 to-transparent" />
      {badge && (
        <div className="label-mono absolute bottom-4 left-4 rounded-full border border-border bg-bg/60 px-3 py-1.5 backdrop-blur-sm">
          {badge}
        </div>
      )}
    </div>
  );
}

// Mock de app MiO4u em CSS puro (acento azul).
function AppMock() {
  const cards = [
    {
      Icon: CalendarClock,
      label: "PRÓXIMO EMBARQUE",
      title: "Turno A · Heliponto Macaé",
      meta: "26/06 · 09:00",
      tone: "blue" as const,
    },
    {
      Icon: ShieldCheck,
      label: "ASO",
      title: "Válido",
      meta: "vence em 138 dias",
      tone: "ok" as const,
    },
    {
      Icon: GraduationCap,
      label: "TREINAMENTOS",
      title: "HUET · CA-EBS · NR-37",
      meta: "3 de 3 em dia",
      tone: "ok" as const,
    },
  ];
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-full max-w-[280px] rounded-[2rem] border border-border bg-surface-2 p-3 shadow-2xl shadow-black/40">
        <div className="rounded-[1.5rem] bg-bg p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted">
                MiO4u
              </p>
              <p className="font-display text-lg leading-tight text-fg">
                Olá, equipe
              </p>
            </div>
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border">
              <Bell size={16} className="text-fg-muted" aria-hidden />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue" />
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {cards.map(({ Icon, label, title, meta, tone }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    background:
                      tone === "blue"
                        ? "rgba(89,124,255,0.14)"
                        : "rgba(255,255,255,0.05)",
                  }}
                >
                  <Icon
                    size={17}
                    aria-hidden
                    style={{
                      color: tone === "blue" ? "var(--color-blue)" : "#4ade80",
                    }}
                  />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg-muted">
                    {label}
                  </p>
                  <p className="truncate text-sm text-fg">{title}</p>
                  <p className="font-mono text-[10px] text-fg-muted">{meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StageMedia({ media }: { media: Media }) {
  return media.kind === "mock" ? (
    <AppMock />
  ) : (
    <StageImage src={media.src} alt={media.alt} badge={media.badge} />
  );
}

// Conteúdo textual de um estágio (compartilhado entre estático e animado).
function StageBody({ stage }: { stage: Stage }) {
  const accent = accentVar(stage.accent);
  return (
    <div className="relative flex flex-col justify-center">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-8 right-0 select-none font-display leading-none md:-top-14"
        style={{
          fontSize: "clamp(6rem, 16vw, 13rem)",
          color: accent,
          opacity: 0.07,
        }}
      >
        {stage.num}
      </span>
      <p
        className="label-mono mb-4"
        style={{ color: accent }}
      >
        {stage.label}
      </p>
      <h3
        className="font-display tracking-tight text-fg"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
      >
        {stage.title}
      </h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-fg-muted">
        {stage.body}
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {stage.bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm text-fg">
            <Check
              size={16}
              aria-hidden
              className="mt-0.5 shrink-0"
              style={{ color: accent }}
            />
            <span className="leading-snug">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout estático (mobile < 768px ou reduced-motion): 3 blocos empilhados.
// ---------------------------------------------------------------------------
function StaticStages() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-20 px-6 pb-24">
      {STAGES.map((stage) => (
        <article
          key={stage.id}
          id={stage.id}
          className="scroll-mt-24"
          style={{ ["--accent" as string]: accentVar(stage.accent) }}
        >
          <div className="mb-6 h-64 sm:h-80">
            <StageMedia media={stage.media} />
          </div>
          <StageBody stage={stage} />
        </article>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout animado (desktop): painel sticky com crossfade dirigido por scroll.
// ---------------------------------------------------------------------------
function ScrollytellingStages() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const wrapper = wrapperRef.current;
    if (!panel || !wrapper) return;

    const stages = gsap.utils.toArray<HTMLElement>("[data-stage]", panel);
    const mediaOf = (i: number) =>
      stages[i].querySelector<HTMLElement>("[data-media]");
    let activeIdx = -1;

    const setActive = (idx: number) => {
      if (idx === activeIdx) return;
      activeIdx = idx;
      railRef.current?.style.setProperty("--accent", accentVar(STAGES[idx].accent));
      dotRefs.current.forEach((d, i) =>
        d?.setAttribute("data-active", String(i === idx)),
      );
    };

    const ctx = gsap.context(() => {
      gsap.set(stages[0], { autoAlpha: 1, y: 0 });
      gsap.set([stages[1], stages[2]], { autoAlpha: 0, y: 20 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          // Pin via ScrollTrigger (não CSS sticky): sticky não funciona dentro
          // do #smooth-content do ScrollSmoother (wrapper fixed/overflow-hidden).
          // pinSpacing:false → o wrapper de 360vh já fornece a distância de scroll.
          pin: panel,
          pinSpacing: false,
          anticipatePin: 1,
          // Este useLayoutEffect (filho) roda ANTES do useLayoutEffect do App
          // que cria o ScrollSmoother; sem pinType explícito o trigger resolve
          // "fixed", e position:fixed dentro do #smooth-content transformado
          // treme conforme o lerp do smoother. Transform pina no mesmo tick.
          pinType: "transform",
          // scrub numérico: o avanço visual "persegue" o scroll suavemente,
          // em vez de saltar. Janelas de estágio equilibradas (~1/3 cada) com
          // transições curtas de 10% entre elas.
          scrub: 0.8,
          // Assenta o usuário nos centros dos 3 estágios (progresso 0 / .5 / 1)
          // sem esforço, depois que o scroll para.
          snap: {
            snapTo: [0, 0.5, 1],
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
            directional: true,
            delay: 0.05,
          },
          onUpdate: (self) => {
            const p = self.progress;
            // Barra de progresso: derivada contínua de st.progress (transform-only).
            if (fillRef.current)
              fillRef.current.style.transform = `scaleY(${p})`;
            // Estágio ativo: troca discreta nos meios das transições (0.33 / 0.67).
            setActive(p < 0.33 ? 0 : p < 0.67 ? 1 : 2);
          },
        },
      });
      // Normaliza o total do timeline para 1 → posições = frações de scroll.
      tl.to({}, { duration: 1 }, 0);

      // Transição 01 → 02 (janela 0.28–0.38; estágio 02 assenta em 0.38–0.62)
      tl.to(stages[0], { autoAlpha: 0, y: -20, duration: 0.1 }, 0.28);
      tl.fromTo(mediaOf(1), { scale: 1.04 }, { scale: 1, duration: 0.1 }, 0.28);
      tl.fromTo(
        stages[1],
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.1 },
        0.28,
      );
      // Transição 02 → 03 (janela 0.62–0.72; estágio 03 assenta em 0.72–1.0)
      tl.to(stages[1], { autoAlpha: 0, y: -20, duration: 0.1 }, 0.62);
      tl.fromTo(mediaOf(2), { scale: 1.04 }, { scale: 1, duration: 0.1 }, 0.62);
      tl.fromTo(
        stages[2],
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.1 },
        0.62,
      );
    }, panel);

    setActive(0);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[360vh]">
      {/* Âncoras posicionadas ao longo do trecho de rolagem (#mio/#mio4u/#emio). */}
      {STAGES.map((stage, i) => (
        <span
          key={stage.id}
          id={stage.id}
          aria-hidden
          className="pointer-events-none absolute left-0 block h-px w-px scroll-mt-24"
          style={{ top: `${ANCHOR_VH[i]}vh` }}
        />
      ))}

      <div
        ref={panelRef}
        className="flex h-screen items-center overflow-hidden"
      >
        <div className="relative mx-auto w-full max-w-7xl px-10 lg:px-16">
          {/* Trilha de progresso vertical + labels clicáveis */}
          <div
            ref={railRef}
            className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 flex-col items-start gap-6 lg:left-6"
            style={{ ["--accent" as string]: "var(--color-red)" }}
          >
            <div className="absolute left-[5px] top-1 h-[calc(100%-0.5rem)] w-px bg-border">
              <span
                ref={fillRef}
                className="absolute inset-x-0 top-0 block h-full origin-top bg-[var(--accent)]"
                style={{ transform: "scaleY(0)" }}
              />
            </div>
            {STAGES.map((stage, i) => (
              <a
                key={stage.id}
                href={`#${stage.id}`}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                data-active="false"
                aria-label={`Ir para ${stage.short}`}
                className="group relative flex items-center gap-3 pl-4 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted transition-colors data-[active=true]:text-fg"
              >
                <span className="absolute left-0 h-[11px] w-[11px] -translate-x-[3px] rounded-full border border-border bg-surface transition-colors group-data-[active=true]:border-[var(--accent)] group-data-[active=true]:bg-[var(--accent)]" />
                {stage.short}
              </a>
            ))}
          </div>

          {/* Estágios empilhados (crossfade) */}
          <div className="relative ml-16 h-[74vh] lg:ml-24">
            {STAGES.map((stage) => (
              <article
                key={stage.id}
                data-stage
                className="absolute inset-0 grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12"
                style={{ ["--accent" as string]: accentVar(stage.accent) }}
              >
                <StageBody stage={stage} />
                <div data-media className="h-[52vh] w-full">
                  <StageMedia media={stage.media} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
export default function Ecossistema() {
  const isStatic = useStaticLayout();
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Reveal do H2 com SplitText (desativado em reduced-motion).
  useLayoutEffect(() => {
    const heading = headingRef.current;
    if (!heading || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(heading, {
        type: "lines,words",
        mask: "lines",
      });
      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.04,
        scrollTrigger: { trigger: heading, start: "top 85%" },
      });
      return () => split.revert();
    }, heading);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <p className="label-mono">O ECOSSISTEMA</p>
        <h2
          ref={headingRef}
          className="mt-5 font-display tracking-tight text-fg"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.015em" }}
        >
          Três sistemas, uma operação.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-fg-muted md:text-lg">
          Da gestão central ao bolso do colaborador e ao berço do porto, o MiO
          cobre a operação offshore de ponta a ponta.
        </p>
      </div>

      <div className="mt-16 md:mt-8">
        {isStatic ? <StaticStages /> : <ScrollytellingStages />}
      </div>
    </section>
  );
}
