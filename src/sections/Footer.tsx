import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "MiO", href: "#mio" },
  { label: "MiO4u", href: "#mio4u" },
  { label: "eMiO", href: "#emio" },
  { label: "Recuperação de créditos", href: "#creditos" },
];

const INSTITUTIONAL_LINKS = [
  { label: "O Ecossistema", href: "#mio" },
  { label: "Créditos", href: "#creditos" },
  { label: "FAQ", href: "#faq" },
  { label: "Falar com um especialista", href: "#contato" },
];

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group relative inline-block w-fit py-0.5 text-sm text-fg-muted transition-colors duration-200 hover:text-fg"
    >
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-red transition-transform duration-[180ms] ease-[var(--ease-brand)] group-hover:scale-x-100 motion-reduce:transition-none" />
    </a>
  );
}

export default function Footer() {
  return (
    <footer id="footer" className="relative overflow-hidden border-t border-border bg-surface pt-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 pb-16 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <a href="#topo" aria-label="BMF Soluções, início" className="inline-block w-fit">
              <img src="/brand/logo-branco.svg" alt="BMF Soluções" className="h-7 w-auto" />
            </a>
          </div>

          <nav aria-label="Produtos">
            <p className="label-mono mb-4">Produtos</p>
            <ul className="flex flex-col gap-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Institucional">
            <p className="label-mono mb-4">Institucional</p>
            <ul className="flex flex-col gap-3">
              {INSTITUTIONAL_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label-mono mb-4">Contato</p>
            <ul className="flex flex-col gap-3 text-sm text-fg-muted">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  Rio das Ostras / RJ
                  <br />
                  Rua Niterói, 2199 · Atlântica
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href="tel:+5522988028267"
                  aria-label="Ligar para (22) 98802-8267"
                  className="hover:text-fg"
                >
                  (22) 98802-8267
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href="tel:+5522981418191"
                  aria-label="Ligar para (22) 98141-8191"
                  className="hover:text-fg"
                >
                  (22) 98141-8191
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href="mailto:bmfsolucoes@bmfsolucoes.com.br"
                  aria-label="Enviar e-mail para bmfsolucoes@bmfsolucoes.com.br"
                  className="hover:text-fg"
                >
                  bmfsolucoes@bmfsolucoes.com.br
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <a
                  href="mailto:suporte@bmfsolucoes.com.br"
                  aria-label="Enviar e-mail para suporte@bmfsolucoes.com.br"
                  className="hover:text-fg"
                >
                  suporte@bmfsolucoes.com.br
                </a>
              </li>
              <li className="text-xs text-fg-muted/80">Comercial 08:00–17:30 · Suporte 09:00–17:00</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-border py-6 font-mono text-xs text-fg-muted">
          <p>Tecnologia inteligente para operações eficientes.</p>
          <p>BMF Soluções Técnicas e Serviços de Engenharia Ltda · CNPJ 27.833.261/0001-49</p>
          <p>© 2016–2026 BMF Soluções. Todos os direitos reservados.</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none w-full select-none whitespace-nowrap text-center font-display text-[12vw] leading-none text-surface-2"
        style={{ letterSpacing: "-0.02em" }}
      >
        BMF SOLUÇÕES
      </p>
    </footer>
  );
}
