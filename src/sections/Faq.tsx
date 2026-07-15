import { useId, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { prefersReducedMotion } from "../lib/gsap";

interface Pergunta {
  q: string;
  a: string;
}

interface Categoria {
  nome: string;
  perguntas: Pergunta[];
}

const CATEGORIAS: Categoria[] = [
  {
    nome: "MiO",
    perguntas: [
      {
        q: "O que é o MiO?",
        a: "Uma plataforma de gestão operacional que conecta pessoas, processos e operações offshore em um único ambiente: logística de pessoal, ASO, treinamentos, timesheet, planejamento, SMS e documentação, com dashboards em tempo real.",
      },
      {
        q: "O MiO é modular? Preciso contratar tudo?",
        a: "Não. A arquitetura é modular e contratável conforme a necessidade da operação. Você ativa os módulos que usa e adiciona os demais quando fizer sentido.",
      },
      {
        q: "Onde ficam os dados e o sistema é seguro?",
        a: "O MiO é hospedado na Microsoft Azure e oferece acesso multiusuário com permissões por perfil, login via Google e Microsoft. É bilíngue (português e inglês).",
      },
    ],
  },
  {
    nome: "MiO4u",
    perguntas: [
      {
        q: "O que o colaborador acessa no MiO4u?",
        a: "ASO, treinamentos, certificados e escala, com notificações de exames pendentes e mudanças na logística. Inclui ponto/timesheet e um Gestor de Chamados, sincronizado em tempo real com o MiO.",
      },
      {
        q: "Preciso instalar algo? Em quais idiomas funciona?",
        a: "O MiO4u é acessado como aplicativo web (PWA) pelo navegador, em português, inglês e espanhol, com modo claro e escuro.",
      },
    ],
  },
  {
    nome: "eMiO",
    perguntas: [
      {
        q: "O que é o eMiO e onde ele opera?",
        a: "É a plataforma de gestão de reservas e ocupação de berços portuários, com calendário operacional inteligente, monitoramento em tempo real e alertas automáticos. Está em operação no Porto do Açu, junto ao consórcio DOME (Gran Services + Prumo Logística).",
      },
    ],
  },
  {
    nome: "Créditos",
    perguntas: [
      {
        q: "Como funciona a cobrança da recuperação de créditos?",
        a: "Por êxito. A avaliação preliminar é sem custo e a cobrança incide apenas sobre o valor efetivamente recuperado. A recuperação de créditos previdenciários inclui seguro de responsabilidade civil profissional.",
      },
      {
        q: "Quanto tempo leva a análise?",
        a: "Para créditos previdenciários, o prazo típico é de 15 dias após a avaliação. Na Análise de Passivo de Medição, o software reduz um processo que levava até 8 meses para cerca de 1 mês.",
      },
    ],
  },
];

function AccordionItem({ q, a }: Pergunta) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const transition = reduced ? { duration: 0 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="border-b border-border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-lg text-fg sm:text-xl">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={transition}
          className="shrink-0 text-fg-muted"
        >
          <ChevronDown className="size-5" aria-hidden />
        </motion.span>
      </button>
      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={transition}
        style={{ overflow: "hidden" }}
      >
        <p className="pb-6 pr-10 text-base leading-relaxed text-fg-muted">{a}</p>
      </motion.div>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <p className="label-mono">Perguntas frequentes</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em] text-fg">
          O que costumam perguntar.
        </h2>

        <div className="mt-14 space-y-12">
          {CATEGORIAS.map((categoria) => (
            <div key={categoria.nome}>
              <p className="label-mono">{categoria.nome}</p>
              <div className="mt-3">
                {categoria.perguntas.map((pergunta) => (
                  <AccordionItem key={pergunta.q} {...pergunta} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <motion.a
            href="#contato"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-fg"
          >
            Não achou sua pergunta? Fale com um especialista
            <ArrowRight className="size-4" aria-hidden />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
