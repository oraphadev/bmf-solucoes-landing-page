import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { EASE_BRAND } from "../lib/anim";

interface Servico {
  numero: string;
  titulo: string;
  corpo: string;
}

const SERVICOS: Servico[] = [
  {
    numero: "01",
    titulo: "Créditos previdenciários",
    corpo:
      "Revisão dos últimos 60 meses de recolhimentos para identificar contribuições pagas a maior na folha. Avaliação preliminar sem custo · prazo típico de 15 dias após a avaliação · cobrança apenas por êxito · seguro de responsabilidade civil profissional incluído.",
  },
  {
    numero: "02",
    titulo: "Créditos tributários",
    corpo:
      "Identificação de bitributação, pagamentos indevidos e incentivos fiscais não aproveitados, por via administrativa e judicial.",
  },
  {
    numero: "03",
    titulo: "Análise de passivo de medição",
    corpo:
      "Software proprietário com IA e redes neurais (desenvolvido em 2016) para identificar valores contratuais faturáveis não cobrados. Recuperação média de 3,5% do valor do contrato · análise reduzida de até 8 meses para cerca de 1 mês · cobrança por êxito.",
  },
  {
    numero: "04",
    titulo: "Redução de consumo de energia",
    corpo:
      "Estudo de engenharia sobre infraestrutura e carga elétrica, com análise de viabilidade e payback. Modelo por locação de equipamento com manutenção inclusa e zero investimento inicial.",
  },
];

// ponytail: `.label-mono` global é fixo em --fg-muted (não-layered, vence sobre utilities de cor);
// nesta seção de fundo claro usamos um mono-label próprio em vez de tentar sobrescrevê-lo.
const LABEL_INK = "font-mono text-xs uppercase tracking-[0.2em]";

/** Realça números/percentuais isolados em --red-deep, mantendo o resto do texto intacto. */
function realceNumeros(texto: string) {
  const partes = texto.split(/(\d[\d.,]*%?\s?(?:meses?|mês|dias?)?)/g);
  return partes.map((parte, i) =>
    /\d/.test(parte) ? (
      <span key={i} className="text-red-deep font-medium">
        {parte}
      </span>
    ) : (
      <span key={i}>{parte}</span>
    ),
  );
}

export default function Creditos() {
  const sectionRef = useRef<HTMLElement>(null);
  const coverTopRef = useRef<HTMLDivElement>(null);
  const coverBottomRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Transição de fundo: capas escuras "sobem" revelando o --paper ao entrar/sair.
      if (coverTopRef.current) {
        gsap.fromTo(
          coverTopRef.current,
          { scaleY: 1 },
          {
            scaleY: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "top 20%",
              scrub: true,
            },
          },
        );
      }
      if (coverBottomRef.current) {
        gsap.fromTo(
          coverBottomRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "bottom 80%",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      // Reveal linha a linha: hairline desenha da esquerda, depois o texto sobe com fade.
      const rows = gsap.utils.toArray<HTMLElement>(".credito-row", rowsRef.current);
      rows.forEach((row, i) => {
        const hairline = row.querySelector(".credito-hairline");
        const content = row.querySelector(".credito-content");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 85%" },
          delay: i * 0.12,
        });
        if (hairline) {
          tl.fromTo(
            hairline,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.4, ease: EASE_BRAND, transformOrigin: "left" },
          );
        }
        if (content) {
          tl.fromTo(
            content,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.4, ease: EASE_BRAND },
            "<0.1",
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="creditos"
      ref={sectionRef}
      className="relative overflow-hidden bg-paper py-24 text-ink sm:py-32"
    >
      <div
        ref={coverTopRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-full origin-top scale-y-0 bg-bg"
      />
      <div
        ref={coverBottomRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-full origin-bottom scale-y-0 bg-bg"
      />

      <div className="relative z-20 mx-auto max-w-5xl px-6">
        <div className="flex flex-col gap-4 border-b border-black/12 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={`${LABEL_INK} text-ink/50`}>Recuperação de créditos · consultoria</p>
            <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em]">
              Receita que já é sua, de volta ao caixa.
            </h2>
          </div>
          <span
            className={`${LABEL_INK} inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-black/12 px-4 py-2 text-ink/60`}
          >
            Cobrança por êxito · avaliação preliminar sem custo
          </span>
        </div>

        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70">
          Antes do software, a BMF nasceu recuperando créditos com análise de dados. Modelo por
          êxito: análise inicial sem custo, cobrança apenas sobre o resultado.
        </p>

        <div ref={rowsRef} className="mt-16">
          {SERVICOS.map((servico) => (
            <div key={servico.numero} className="credito-row relative">
              <div className="credito-hairline h-px w-full origin-left bg-black/12" />
              <div className="credito-content grid gap-x-8 gap-y-3 py-8 sm:grid-cols-[96px_1fr] md:grid-cols-[96px_280px_1fr]">
                <span className="font-mono text-sm text-red-deep tabular-nums">
                  {servico.numero}
                </span>
                <h3 className="font-mono text-sm font-medium uppercase tracking-[0.08em] text-ink">
                  {servico.titulo}
                </h3>
                <p className="text-base leading-relaxed text-ink/70 sm:col-span-2 md:col-span-1 md:col-start-3">
                  {realceNumeros(servico.corpo)}
                </p>
              </div>
            </div>
          ))}
          <div className="h-px w-full bg-black/12" />
        </div>

        <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.a
            href="#contato"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper"
          >
            Solicitar avaliação sem custo
            <ArrowRight className="size-4" aria-hidden />
          </motion.a>
          <p className={`${LABEL_INK} text-ink/50`}>
            Análise preliminar gratuita. Você só paga sobre o que for recuperado.
          </p>
        </div>
      </div>
    </section>
  );
}
