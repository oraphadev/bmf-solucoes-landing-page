# SPEC — Landing Page BMF Soluções

> Fonte da verdade de conteúdo e direção para a nova landing page da BMF Soluções (bmfsolucoes.com.br).
> Direção visual: **"Deep Rig"** (dark industrial premium, 100% paleta da marca, acento = vermelho da marca).
> Idioma do site/copy: **PT-BR**. Idioma do código: **inglês**.
> Toda a copy abaixo é **final** — implementar literalmente. Proibido inventar métricas, clientes ou depoimentos.
> Claims permitidos vêm exclusivamente do DISCOVERY; autodeclarações da empresa são rotuladas como tal.

---

## 0. Stack e fundação técnica

| Camada | Escolha | Observação |
|---|---|---|
| Framework | React 19 + Vite + TypeScript | pnpm |
| Estilo | Tailwind CSS v4 (`@tailwindcss/vite`) | tokens via `@theme` em `src/index.css` |
| Scroll/cenas | GSAP 3.13+ | plugins gratuitos: ScrollTrigger, ScrollSmoother, SplitText — registrar **uma vez** em `src/lib/gsap.ts` |
| Micro-interações | `motion` (import de `motion/react`) | hover/press, cards, acordeão, nav |
| Ícones | `lucide-react` | **nunca emoji como ícone** |
| Fontes | `@fontsource/questrial`, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono` | únicas deps extras permitidas além das listadas |

**Regra de degradação de assets:** todo componente que referencia imagem/vídeo (`/img/*`, `/video/*`) deve degradar para gradiente escuro (`--bg` → `--surface-2`) sem quebrar layout caso o arquivo ainda não exista. Nada de `alt` vazio, nada de caixa quebrada.

### 0.1 Design tokens (`@theme`)

```css
@theme {
  /* superfícies */
  --color-bg: #090909;          /* Preto Profundo da marca — NUNCA #000 */
  --color-surface: #101012;
  --color-surface-2: #16161A;
  --color-graphite: #323232;
  --color-border: rgba(255,255,255,0.08);   /* hairlines */

  /* texto */
  --color-fg: #FFFFFF;
  --color-fg-muted: #A1A3B4;    /* Azul Apagado da marca */

  /* acentos (marca) */
  --color-red: #F14D41;         /* Vermelho Vívido — CTA/acento/interação */
  --color-red-deep: #AB1F1A;    /* Vermelho Escuro Intenso — glows, gradientes profundos */
  --color-blue: #597CFF;        /* Azul Vívido — acento secundário, reservado ao universo MiO4u/dados */

  /* seção editorial clara (Créditos) */
  --color-paper: #F8F8F7;
  --color-ink: #16161A;

  /* tipografia */
  --font-display: "Questrial", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace;

  /* motion */
  --ease-brand: cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Regra da marca (inviolável):** vermelho e azul vívidos são **acento** — botões, indicadores, destaques, beacons. Nunca cor dominante. Glow discreto **apenas** em CTA e beacons. Fundo dominante é sempre `--bg`/`--surface`.

### 0.2 Escala tipográfica

| Uso | Fonte | Tratamento |
|---|---|---|
| H1 hero | display (Questrial) | `clamp(3rem, 8vw, 7rem)`, `letter-spacing: -0.02em`, `line-height: 0.95` |
| H2 seção | display | `clamp(2rem, 4vw, 3.5rem)`, `letter-spacing: -0.015em` |
| H3 card | display | `clamp(1.25rem, 2vw, 1.75rem)` |
| Corpo | body (Inter) | `1rem`–`1.125rem`, `line-height: 1.6`, cor `--fg-muted` para parágrafos longos |
| Label técnico | mono (JetBrains) | `11–12px`, `uppercase`, `letter-spacing: 0.14em`, cor `--fg-muted` |
| KPI / número | mono | oversized, `font-variant-numeric: tabular-nums` |

### 0.3 Grain global

SVG `feTurbulence` fixo em overlay (`position: fixed; inset: 0; pointer-events: none; mix-blend-mode: overlay; opacity: 0.03; z-index: 1`). Um único nó, `baseFrequency` ~0.9, `numOctaves` 2. Não anima.

### 0.4 Motion — regras globais

- Easing padrão: `var(--ease-brand)`.
- Micro-interações: 150–300ms. Reveals com stagger 30–50ms. Exit ≈ 65% da duração do enter.
- **Apenas `transform` e `opacity`** — zero CLS. Toda animação interruptível.
- `prefers-reduced-motion: reduce` → desativa ScrollSmoother, parallax e reveals pesados; conteúdo legível imediatamente (estado final aplicado sem transição). Contadores exibem valor final direto.
- **GSAP** = cenas de scroll (pin, scrub, SplitText, contadores). **Motion** = micro-interações.

### 0.5 A11y — regras globais

Contraste AA mínimo; `:focus-visible` sempre visível (ring 2px `--red` com offset); HTML semântico; **um único `<h1>`** (no hero); `alt` em PT-BR em toda imagem; touch targets ≥ 44px; `aria-label` em todo botão de ícone; acordeões com `aria-expanded`/`aria-controls`.

---

## 1. Arquitetura da página (ordem exata)

| # | Seção | Componente | Âncora | Fundo |
|---|---|---|---|---|
| 1 | Navegação | `Nav` | — | transparente → blur ao rolar |
| 2 | Hero | `Hero` | `#topo` | `--bg` + vídeo/imagem |
| 3 | Prova social | `ProvaSocial` | — | `--bg` |
| 4 | Ecossistema (scrollytelling pinado) | `Ecossistema` | `#mio` `#mio4u` `#emio` | `--surface` |
| 5 | Bento de módulos do MiO | `BentoMio` | `#mio` (compartilha) | `--bg` |
| 6 | Produto em ação (terminal/log) | `ProdutoEmAcao` | — | `--surface-2` |
| 7 | Métricas | `Metricas` | — | `--bg` |
| 8 | Créditos (seção auditável, fundo claro) | `Creditos` | `#creditos` | `--paper` (claro) |
| 9 | FAQ | `Faq` | `#faq` | `--surface` |
| 10 | CTA final | `CtaFinal` | `#contato` | `--bg` + glow |
| 11 | Footer | `Footer` | `#contato` (compartilha) | `--surface` |

Ordem fixa. `ScrollSmoother` envolve o conteúdo entre Nav (fixa, fora do smoother) e Footer.

---

## 2. Copy final por seção

> Toda copy abaixo é literal. Labels em mono/uppercase estão marcadas `[label]`. CTAs marcados `[CTA]`.

### 2.1 Nav

- Logo: `/brand/logo-branco.svg` (link para `#topo`, `aria-label="BMF Soluções, início"`).
- Itens: **Ecossistema** (`#mio`) · **MiO4u** (`#mio4u`) · **eMiO** (`#emio`) · **Créditos** (`#creditos`) · **FAQ** (`#faq`)
- `[CTA]` primário (pill sólido `--red`): **Falar com um especialista** → `#contato`
- Mobile: menu hambúrguer (`aria-label="Abrir menu"`), drawer com os mesmos itens.

### 2.2 Hero

```
[label]  BMF SOLUÇÕES · RIO DAS OSTRAS / MACAÉ

H1:      Sua operação offshore, sob controle.

Subtítulo (tagline da marca, obrigatória):
         Tecnologia inteligente para operações eficientes.

Corpo:   O Ecossistema MiO conecta pessoas, escalas, documentação e berços
         portuários em um único ambiente. Feito para quem opera na Bacia de
         Campos e não pode parar.

[CTA primário]   Falar com um especialista        → #contato
[CTA secundário] Conhecer o MiO                    → #mio   (ghost, borda hairline)

[label rodapé do hero]  ECOSSISTEMA MiO · MiO4u · eMiO · RECUPERAÇÃO DE CRÉDITOS
```

`alt` do vídeo/imagem de fundo: `"Plataforma offshore em operação ao entardecer na Bacia de Campos"`.

### 2.3 Prova social

```
[label]  OPERAÇÃO REAL, PARCEIROS REAIS

Título curto (opcional, mono, não é H2):
         Presentes na cadeia offshore da Bacia de Campos
```

Marquee horizontal infinito, **texto em mono** (sem logos de terceiros — nomes apenas), grayscale/`--fg-muted`, separador `·`:

```
CIS BRASIL · ABZ GROUP · GRAN SERVICES · HEFTOS · RIP · ESTRUTURAL ·
MANSERV · SSE · ENGEMAN · ACTEMIUM · TECHOCEAN · OES
```

Microcopy abaixo (mono, muted, honestidade): `Parceiros e clientes citados no portfólio da BMF.`

### 2.4 Ecossistema (scrollytelling pinado — 3 painéis)

```
[label]  O ECOSSISTEMA

H2:      Três sistemas, uma operação.
Corpo:   Da gestão central ao bolso do colaborador e ao berço do porto,
         o MiO cobre a operação offshore de ponta a ponta.
```

**Painel 1 — MiO** (`#mio`) · acento `--red`
```
[label]  MiO · PLATAFORMA DE GESTÃO OPERACIONAL
H3:      O centro de comando da operação.
Corpo:   Planejamento, execução, logística de pessoal, qualidade, SMS e
         documentação em um só ambiente. Escalas, folgas, dobras, embarques e
         desembarques com alertas automáticos de vencimento de ASO e treinamento.
Bullets:
  · Logística de pessoal offshore (embarque, desembarque, escala, dobra)
  · Controle de ASO, treinamentos e documentação obrigatória
  · Dashboards gerenciais em tempo real e integração com Power BI e ERPs
  · Hospedagem em Microsoft Azure · bilíngue PT/EN
```
Imagem: `/img/helideck.jpg` — `alt="Helideck de plataforma offshore com helicóptero em aproximação"`.

**Painel 2 — MiO4u** (`#mio4u`) · acento `--blue`
```
[label]  MiO4u · APP DO COLABORADOR
H3:      A operação no bolso de quem embarca.
Corpo:   Portal exclusivo do colaborador, sincronizado em tempo real com o MiO.
         ASO, treinamentos, certificados e escala na palma da mão, com
         notificações de exames pendentes e mudanças na logística.
Bullets:
  · ASO, treinamentos e certificados sempre à mão
  · Notificações de pendências e mudanças de escala
  · Ponto/timesheet e Gestor de Chamados
  · PWA · português, inglês e espanhol · modo claro e escuro
```
Imagem: `/img/embarcacao.jpg` — `alt="Colaborador com EPI em embarcação de apoio offshore"`.

**Painel 3 — eMiO** (`#emio`) · acento `--red`
```
[label]  eMiO · GESTÃO DE BERÇOS PORTUÁRIOS
H3:      O berço certo, na hora certa.
Corpo:   Gestão de reservas e ocupação de berços portuários com calendário
         operacional inteligente, monitoramento em tempo real e alertas
         automáticos. Em operação no Porto do Açu.
Bullets:
  · Calendário operacional inteligente de berços
  · Monitoramento em tempo real e alertas automáticos
  · Indicadores de gestão e agendamento integrado
  · Em operação no Porto do Açu (consórcio DOME · Gran Services + Prumo Logística)
```
Imagem: `/img/porto.jpg` — `alt="Berço portuário com embarcação atracada no Porto do Açu"`.

### 2.5 Bento de módulos do MiO

```
[label]  DENTRO DO MiO

H2:      Arquitetura modular. Contrate o que a operação precisa.
Corpo:   Cada módulo resolve uma dor concreta da operação offshore e conversa
         com todos os outros.
```

Cards (grid assimétrico, ícones lucide-react):

| Card | Ícone (lucide) | Título | Descrição |
|---|---|---|---|
| Grande (screenshot) | — | **Logística de pessoal offshore** | Embarques, desembarques, escalas, folgas e dobras em um painel único, com histórico rastreável. |
| Médio | `ShieldCheck` | **ASO e conformidade** | Alertas automáticos de vencimento de ASO, treinamentos e documentação obrigatória. |
| Médio | `Clock` | **Timesheet** | Apontamento de horas e registros operacionais integrados à folha. |
| Pequeno | `CalendarRange` | **Planejamento de obras** | Cronogramas, orçamento, etapas e documentos por projeto. |
| Pequeno | `LayoutDashboard` | **Dashboards em tempo real** | KPIs e relatórios analíticos, com integração Power BI. |
| Pequeno | `Users` | **Multiusuário por perfil** | Acesso com permissões por função e login Google ou Microsoft. |

Card grande usa `/img/hero-plataforma.jpg` como textura ou screenshot do MiO — `alt="Painel do MiO exibindo logística de pessoal offshore"`.

### 2.6 Produto em ação (terminal/log ao vivo)

```
[label]  MiO · EM OPERAÇÃO AGORA

H2:      A operação acontecendo, linha por linha.
Corpo:   Enquanto a equipe embarca, o MiO registra, valida e alerta em tempo real.
```

Terminal animado (mono). Eventos **plausíveis** de operação offshore aparecendo em sequência (dados fictícios ilustrativos — nenhum nome real de pessoa). Prefixos coloridos: `[OK]` verde-neutro/`--blue`, `[ALERTA]` `--red`, `[INFO]` `--fg-muted`.

```
09:02  [OK]      Embarque confirmado · Escala Turno A · Heliponto Macaé
09:03  [INFO]    Sincronizando MiO4u · 38 colaboradores atualizados
09:05  [ALERTA]  ASO vence em 7 dias · reprogramar antes do próximo embarque
09:07  [OK]      Timesheet fechado · Sonda P-XX · período 26/06–09/07
09:09  [INFO]    Berço reservado · eMiO · janela 14:00–20:00 · Porto do Açu
09:11  [ALERTA]  Treinamento obrigatório pendente · bloqueio de escala
09:13  [OK]      Dobra aprovada · cobertura de folga registrada
```

Rótulo de honestidade (mono, muted): `Simulação ilustrativa da operação do MiO.`

### 2.7 Métricas

```
[label]  NÚMEROS DA BMF

H2:      O que a tecnologia já entrega.
```

Contadores (count-up). **Somente números reais do DISCOVERY, com rótulo honesto:**

| Número | Label | Rótulo de origem (mono, muted) |
|---|---|---|
| **2016** | Ano de fundação | Início da operação (CNPJ 2017) |
| **3** | Produtos no Ecossistema MiO | MiO · MiO4u · eMiO |
| **126** | Usuários no 1º mês do MiO4u | Fevereiro de 2025 |
| **3,5%** | Recuperação média do valor do contrato | Análise de Passivo de Medição · dado BMF |
| **60** | Meses de folha revisados | Recuperação de créditos previdenciários |
| **~1 mês** | Prazo de análise (antes: até 8 meses) | Análise de Passivo de Medição · dado BMF |

Microcopy geral (mono, muted): `Métricas informadas pela BMF; recuperações não auditadas por terceiros.`

### 2.8 Créditos (seção auditável — fundo claro)

Fundo `--paper` (#F8F8F7), texto `--ink`. Grid rigoroso, tom de documento técnico. Mono para labels e números, hairlines escuras (`rgba(0,0,0,0.1)`).

```
[label]  RECUPERAÇÃO DE CRÉDITOS · CONSULTORIA

H2:      Receita que já é sua, de volta ao caixa.
Corpo:   Antes do software, a BMF nasceu recuperando créditos com análise de dados.
         Modelo por êxito: análise inicial sem custo, cobrança apenas sobre o
         resultado.
```

Os 4 serviços em grid tipo "linha de tabela auditável":

```
01 · CRÉDITOS PREVIDENCIÁRIOS
Revisão dos últimos 60 meses de recolhimentos para identificar contribuições
pagas a maior na folha. Avaliação preliminar sem custo · prazo típico de 15 dias
após a avaliação · cobrança apenas por êxito · seguro de responsabilidade civil
profissional incluído.

02 · CRÉDITOS TRIBUTÁRIOS
Identificação de bitributação, pagamentos indevidos e incentivos fiscais não
aproveitados, por via administrativa e judicial.

03 · ANÁLISE DE PASSIVO DE MEDIÇÃO
Software proprietário com IA e redes neurais (desenvolvido em 2016) para
identificar valores contratuais faturáveis não cobrados. Recuperação média de
3,5% do valor do contrato · análise reduzida de até 8 meses para cerca de 1 mês ·
cobrança por êxito.

04 · REDUÇÃO DE CONSUMO DE ENERGIA
Estudo de engenharia sobre infraestrutura e carga elétrica, com análise de
viabilidade e payback. Modelo por locação de equipamento com manutenção inclusa
e zero investimento inicial.
```

`[CTA]` (nesta seção, botão escuro sobre fundo claro): **Solicitar avaliação sem custo** → `#contato`
Microcopy: `Análise preliminar gratuita. Você só paga sobre o que for recuperado.`

### 2.9 FAQ (acordeão categorizado)

```
[label]  PERGUNTAS FREQUENTES
H2:      O que costumam perguntar.
```

Categorias: **MiO** · **MiO4u** · **eMiO** · **Créditos**.

**MiO**
1. **O que é o MiO?**
   Uma plataforma de gestão operacional que conecta pessoas, processos e operações offshore em um único ambiente: logística de pessoal, ASO, treinamentos, timesheet, planejamento, SMS e documentação, com dashboards em tempo real.
2. **O MiO é modular? Preciso contratar tudo?**
   Não. A arquitetura é modular e contratável conforme a necessidade da operação. Você ativa os módulos que usa e adiciona os demais quando fizer sentido.
3. **Onde ficam os dados e o sistema é seguro?**
   O MiO é hospedado na Microsoft Azure e oferece acesso multiusuário com permissões por perfil, login via Google e Microsoft. É bilíngue (português e inglês).

**MiO4u**
4. **O que o colaborador acessa no MiO4u?**
   ASO, treinamentos, certificados e escala, com notificações de exames pendentes e mudanças na logística. Inclui ponto/timesheet e um Gestor de Chamados, sincronizado em tempo real com o MiO.
5. **Preciso instalar algo? Em quais idiomas funciona?**
   O MiO4u é acessado como aplicativo web (PWA) pelo navegador, em português, inglês e espanhol, com modo claro e escuro.

**eMiO**
6. **O que é o eMiO e onde ele opera?**
   É a plataforma de gestão de reservas e ocupação de berços portuários, com calendário operacional inteligente, monitoramento em tempo real e alertas automáticos. Está em operação no Porto do Açu, junto ao consórcio DOME (Gran Services + Prumo Logística).

**Créditos**
7. **Como funciona a cobrança da recuperação de créditos?**
   Por êxito. A avaliação preliminar é sem custo e a cobrança incide apenas sobre o valor efetivamente recuperado. A recuperação de créditos previdenciários inclui seguro de responsabilidade civil profissional.
8. **Quanto tempo leva a análise?**
   Para créditos previdenciários, o prazo típico é de 15 dias após a avaliação. Na Análise de Passivo de Medição, o software reduz um processo que levava até 8 meses para cerca de 1 mês.

`[CTA]` final do acordeão: **Não achou sua pergunta? Fale com um especialista** → `#contato`

### 2.10 CTA final

```
[label]  ATENDIMENTO DEDICADO AO SETOR OFFSHORE

H2:      Vamos colocar sua operação sob controle.

[CTA primário]   Falar com um especialista     → #contato (mailto/WhatsApp — ver 2.11)
[CTA secundário] Conhecer o MiO                 → #mio

Microcopy:  Atendimento dedicado ao setor offshore em Rio das Ostras / Macaé.
```

Glow discreto `--red-deep` radial atrás dos botões.

### 2.11 Footer

Logo `/brand/logo-branco.svg`. Colunas:

```
PRODUTOS                INSTITUCIONAL           CONTATO
· MiO (#mio)            · O Ecossistema         Rio das Ostras / RJ
· MiO4u (#mio4u)        · Créditos (#creditos)  Rua Niterói, 2199 · Atlântica
· eMiO (#emio)          · FAQ (#faq)            (22) 98802-8267
· Recuperação de          · Falar com um          (22) 98141-8191
  créditos (#creditos)     especialista          bmfsolucoes@bmfsolucoes.com.br
                                                suporte@bmfsolucoes.com.br
                                                Comercial 08:00–17:30 · Suporte 09:00–17:00
```

Rodapé legal (mono, muted):
```
Tecnologia inteligente para operações eficientes.
BMF Soluções Técnicas e Serviços de Engenharia Ltda · CNPJ 27.833.261/0001-49
© 2016–2026 BMF Soluções. Todos os direitos reservados.
```

Botões de contato com `aria-label`. Telefones e e-mails como `tel:`/`mailto:`.

---

## 3. SEO

```html
<html lang="pt-BR">
<title>BMF Soluções: Gestão operacional offshore | Ecossistema MiO</title>  <!-- 58 chars -->
<meta name="description" content="Ecossistema MiO: gestão de escalas, ASO, embarques e berços portuários para o setor offshore da Bacia de Campos. Tecnologia inteligente para operações eficientes."> <!-- 155 chars -->
```

**Open Graph / Twitter:**
```html
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="BMF Soluções">
<meta property="og:title" content="BMF Soluções: Gestão operacional offshore | Ecossistema MiO">
<meta property="og:description" content="Escalas, ASO, embarques e berços portuários em um só sistema. Tecnologia inteligente para operações eficientes.">
<meta property="og:url" content="https://bmfsolucoes.com.br/">
<meta property="og:image" content="https://bmfsolucoes.com.br/img/hero-plataforma.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="BMF Soluções: Gestão operacional offshore | Ecossistema MiO">
<meta name="twitter:description" content="Escalas, ASO, embarques e berços portuários em um só sistema.">
<meta name="twitter:image" content="https://bmfsolucoes.com.br/img/hero-plataforma.jpg">
```

**JSON-LD (dois blocos):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BMF Soluções",
  "legalName": "BMF Soluções Técnicas e Serviços de Engenharia Ltda",
  "url": "https://bmfsolucoes.com.br",
  "logo": "https://bmfsolucoes.com.br/brand/logo-principal.svg",
  "slogan": "Tecnologia inteligente para operações eficientes.",
  "foundingDate": "2016",
  "email": "bmfsolucoes@bmfsolucoes.com.br",
  "telephone": "+55-22-98802-8267",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Rua Niterói, 2199, Bairro Atlântica",
    "addressLocality": "Rio das Ostras",
    "addressRegion": "RJ",
    "postalCode": "28895-642",
    "addressCountry": "BR"
  },
  "areaServed": "Setor offshore de óleo e gás na Bacia de Campos / Macaé"
}
```
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "MiO · Ecossistema BMF",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, Android, iOS",
  "url": "https://mio.app.br",
  "description": "Plataforma modular de gestão operacional offshore: logística de pessoal, ASO, treinamentos, timesheet, planejamento e dashboards em tempo real.",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "BRL", "description": "Sob proposta comercial" },
  "publisher": { "@type": "Organization", "name": "BMF Soluções" }
}
```

**Hierarquia de headings:** um `<h1>` (hero). Cada seção abre com `<h2>`; painéis/cards usam `<h3>`. Labels em mono são `<p>`/`<span>` (não headings).

**Slugs de âncora:** `#mio` · `#mio4u` · `#emio` · `#creditos` · `#faq` · `#contato` (+ `#topo` no hero).

---

## 4. Coreografia de animação por seção

> GSAP = cenas de scroll. Motion = micro-interações. Todas as durações em `var(--ease-brand)`. Todo `prefers-reduced-motion` cai no estado final estático.

### 4.1 Setup global (`src/lib/gsap.ts`)
Registrar `ScrollTrigger`, `ScrollSmoother`, `SplitText` uma única vez. `ScrollSmoother.create({ smooth: 1.2, effects: true })` — **desligar** se `prefers-reduced-motion`.

### 4.2 Nav — **Motion**
- Ao rolar > 40px: encolhe (padding vertical ↓), ganha `backdrop-filter: blur(12px)` + `background: rgba(9,9,9,0.6)` + borda hairline inferior. Transição 200ms.
- Itens: underline animado no hover (scaleX 0→1, `transform-origin: left`, 180ms).
- CTA pill: hover `scale: 1.03`, press `scale: 0.97` (spring leve).

### 4.3 Hero — **GSAP**
- **SplitText** no H1 por linha+palavra: reveal `y: 110% → 0`, `opacity 0→1`, stagger 40ms, duração 800ms, delay após load das fontes (evitar FOUC).
- Label e corpo: fade+`y:20→0`, stagger 50ms, começam 200ms após o H1.
- **Parallax de fundo**: vídeo/imagem `yPercent: 0 → 12` com `scrub`, `ScrollTrigger` do topo até o fim do hero. Overlay escuro `--bg` gradiente para garantir contraste do texto.
- CTAs (Motion): entrada `scale: 0.96→1` + fade, hover 1.03.
- Reduced-motion: sem SplitText/parallax; texto e mídia estáticos, opacidade 1.

### 4.4 Prova social — **GSAP + CSS**
- Marquee: animação linear infinita (`xPercent: -50`, repeat -1, timeline GSAP ou CSS keyframes). Pausa no hover.
- Reduced-motion: marquee estático (lista visível, quebra em linhas), sem loop.

### 4.5 Ecossistema (scrollytelling pinado) — **GSAP**
- `ScrollTrigger` com `pin: true` na seção, `scrub: true`, duração ≈ 300vh.
- Progresso 0→1 troca **3 painéis** (MiO → MiO4u → eMiO): crossfade + `y` sutil (`20px`) entre painéis; a mídia de cada painel entra com `scale: 1.04→1`.
- Barra de progresso lateral (mono, 3 marcadores) sincronizada ao progresso; marcador ativo em `--red` (painéis MiO/eMiO) ou `--blue` (painel MiO4u).
- `id` de cada painel (`#mio`/`#mio4u`/`#emio`) resolve a âncora rolando até o offset correspondente do pin.
- Reduced-motion: sem pin; os 3 painéis viram **3 blocos empilhados** legíveis, cada um com seu `id`.

### 4.6 Bento MiO — **Motion**
- Cards entram com `whileInView`: fade + `y: 24→0`, stagger 40ms (ordem de leitura).
- Hover: `scale: 1.02`, borda hairline → `--red` a 8% de opacidade, 200ms.
- Reduced-motion: cards visíveis, sem entrada/hover transform.

### 4.7 Produto em ação (terminal) — **GSAP**
- `ScrollTrigger` dispara ao entrar 60% no viewport: linhas do log aparecem sequencialmente (fade + `x: -12→0`), stagger 300ms, como se fossem "impressas". Cursor piscando na última linha (CSS).
- Prefixos `[ALERTA]` pulsam uma vez ao entrar (`--red`).
- Reduced-motion: todas as linhas visíveis de imediato, sem stagger nem cursor animado.

### 4.8 Métricas — **GSAP**
- Contadores com `scrub` leve: contam de 0 ao valor ao entrar no viewport (ScrollTrigger `once: true` para não recontar). `tabular-nums`. `3,5%` e `~1 mês` respeitam formatação (interpolar só o número, sufixo estático).
- Cada card: fade + `y:20→0`, stagger 50ms.
- Reduced-motion: valores finais renderizados direto, sem count-up.

### 4.9 Créditos — **GSAP**
- Transição de fundo escuro→claro: a seção entra e o fundo `--paper` "sobe" cobrindo (clip/`y`), sinalizando mudança de registro editorial.
- **Reveal de linhas tipo tabela**: cada um dos 4 serviços revela como linha de documento — hairline desenha da esquerda (`scaleX 0→1`, `transform-origin:left`, 400ms) seguida do texto (fade + `y:12→0`), stagger 120ms entre serviços.
- Numeração `01–04` (mono) conta/aparece junto da linha.
- Reduced-motion: linhas e textos estáticos, hairlines já desenhadas.

### 4.10 FAQ — **Motion**
- Acordeão: `height`/`opacity` via `AnimatePresence` (layout animation em `transform` sempre que possível), 240ms. Ícone chevron rotaciona 180° (`aria-expanded`).
- Um item aberto por vez (opcional) ou múltiplos — permitir múltiplos.
- Reduced-motion: abre/fecha instantâneo, sem rotação animada.

### 4.11 CTA final — **GSAP + Motion**
- Glow `--red-deep` radial: leve pulso de opacidade (0.15↔0.25, 4s, loop) — **único** glow ambiente da página além dos beacons. GSAP.
- Botões: hover `scale:1.03` / press `0.97` (Motion).
- Reduced-motion: glow estático em opacidade média.

### 4.12 Footer — sem animação
Estático. Apenas hover de links (underline, Motion, 180ms).

---

## 5. Mapa de assets

| Asset | Caminho | Onde entra | Fallback |
|---|---|---|---|
| Logo branco (SVG) | `/brand/logo-branco.svg` | Nav, Footer | — |
| Logo principal (SVG) | `/brand/logo-principal.svg` | JSON-LD `logo`, OG se necessário | — |
| Ícone branco (PNG) | `/brand/icone-branco.png` | favicon, ícone de app/PWA | — |
| Globo 3D (render) | `/brand/zip/Globo 3D.png` | elemento decorativo do hero (flutuando, parallax leve) ou selo do Ecossistema | gradiente radial `--red-deep` |
| Vídeo hero (loop) | `/video/hero-loop.mp4` | fundo do Hero (`autoplay muted loop playsinline`), `poster="/img/hero-plataforma.jpg"` | imagem poster → gradiente `--bg`→`--surface-2` |
| Hero plataforma | `/img/hero-plataforma.jpg` | poster do vídeo; OG/Twitter image; textura do card grande do BentoMio | gradiente escuro |
| Helideck | `/img/helideck.jpg` | Ecossistema · Painel MiO | gradiente escuro |
| Embarcação | `/img/embarcacao.jpg` | Ecossistema · Painel MiO4u | gradiente escuro |
| Porto | `/img/porto.jpg` | Ecossistema · Painel eMiO | gradiente escuro |

**Ícones lucide-react** (não emoji): `ShieldCheck`, `Clock`, `CalendarRange`, `LayoutDashboard`, `Users` (BentoMio); `ArrowRight` (CTAs); `Menu`/`X` (nav mobile); `ChevronDown` (FAQ); `Phone`, `Mail`, `MapPin` (footer).

**Regra:** todo `<img>`/`<video>` com `alt` PT-BR já definido nas seções 2.2–2.8. Componente de imagem central (`<Media>`) aplica o fallback de gradiente quando `onError` dispara.

---

*Fim do SPEC. Fonte de conteúdo: DISCOVERY.md (fatos), BRAND.md (marca), referencias-visuais.md (direção Deep Rig). Nenhuma métrica, cliente ou depoimento fora dessas fontes.*
