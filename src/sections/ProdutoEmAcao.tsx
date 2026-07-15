import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { EASE_BRAND } from "../lib/anim";

type Tag = "OK" | "INFO" | "ALERTA";

const TAG_COLOR: Record<Tag, string> = {
  OK: "#47B27F", // verde discreto (status neutro)
  INFO: "var(--color-blue)",
  ALERTA: "var(--color-red)",
};

type LogLine = { time: string; tag: Tag; text: string };

// Simulação ilustrativa — dados fictícios, sem nome real de pessoa (SPEC 2.6).
const LOG: LogLine[] = [
  { time: "09:02", tag: "OK", text: "Embarque confirmado · Escala Turno A · Heliponto Macaé" },
  { time: "09:03", tag: "INFO", text: "Sincronizando MiO4u · 38 colaboradores atualizados" },
  { time: "09:05", tag: "ALERTA", text: "ASO vence em 7 dias · reprogramar antes do próximo embarque" },
  { time: "09:07", tag: "OK", text: "Timesheet fechado · Sonda P-XX · período 26/06–09/07" },
  { time: "09:09", tag: "INFO", text: "Berço reservado · eMiO · janela 14:00–20:00 · Porto do Açu" },
  { time: "09:11", tag: "ALERTA", text: "Treinamento obrigatório pendente · bloqueio de escala" },
  { time: "09:13", tag: "OK", text: "Dobra aprovada · cobertura de folga registrada" },
];

export default function ProdutoEmAcao() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !rootRef.current) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".log-line");
      gsap.set(items, { opacity: 0, x: -12 });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true });
      let at = 0;
      items.forEach((el) => {
        tl.to(el, { opacity: 1, x: 0, duration: 0.3, ease: EASE_BRAND }, at);
        const alert = el.querySelector<HTMLElement>(".tag-alerta");
        if (alert)
          tl.to(alert, { opacity: 0.35, duration: 0.15, yoyo: true, repeat: 1 }, at + 0.15);
        at += 0.5;
      });
      tl.to(items, { opacity: 0, duration: 0.35, ease: EASE_BRAND }, at + 1);

      // Pausa fora do viewport (economiza CPU + respeita foco de atenção).
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => tl.play(),
        onLeave: () => tl.pause(),
        onEnterBack: () => tl.play(),
        onLeaveBack: () => tl.pause(),
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="produto-em-acao"
      className="bg-surface-2 px-5 py-24 sm:px-8 md:py-32"
    >
      <style>{`
        .term-cursor { animation: term-blink 1s steps(2, start) infinite; }
        @keyframes term-blink { 50% { opacity: 0; } }
        @media (prefers-reduced-motion: reduce) {
          .term-cursor { animation: none; }
        }
      `}</style>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Copy — automação e alertas */}
        <div className="max-w-xl">
          <p className="label-mono">MiO · Em operação agora</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em]">
            A operação acontecendo, linha por linha.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">
            Enquanto a equipe embarca, o MiO registra, valida e alerta em
            tempo real.
          </p>
        </div>

        {/* Terminal ao vivo */}
        <div className="overflow-hidden rounded-[16px] border border-border bg-surface shadow-2xl shadow-black/40">
          <div className="flex items-center gap-4 border-b border-border px-4 py-3">
            <span className="flex gap-2" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-red/70" />
              <span className="h-3 w-3 rounded-full bg-graphite" />
              <span className="h-3 w-3 rounded-full bg-graphite" />
            </span>
            <span className="font-mono text-xs text-fg-muted">
              mio · operação ao vivo
            </span>
          </div>

          <div className="overflow-x-auto px-4 py-5 font-mono text-[13px] leading-relaxed sm:px-6">
            <ul className="min-w-[34rem] space-y-2 sm:min-w-0">
              {LOG.map((line) => (
                <li
                  key={line.time + line.text}
                  className="log-line flex gap-3 whitespace-nowrap sm:whitespace-normal"
                >
                  <span className="shrink-0 text-fg-muted/70">{line.time}</span>
                  <span
                    className={`shrink-0 font-medium ${line.tag === "ALERTA" ? "tag-alerta" : ""}`}
                    style={{ color: TAG_COLOR[line.tag] }}
                  >
                    [{line.tag}]
                  </span>
                  <span className="text-fg">{line.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-2 font-mono text-[13px]">
              <span className="text-red">›</span>
              <span
                aria-hidden
                className="term-cursor inline-block h-4 w-2 bg-fg-muted align-middle"
              />
            </div>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-6xl font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
        Simulação ilustrativa da operação do MiO.
      </p>
    </section>
  );
}
