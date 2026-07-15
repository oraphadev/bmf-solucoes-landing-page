import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Ecossistema", href: "#mio" },
  { label: "MiO4u", href: "#mio4u" },
  { label: "eMiO", href: "#emio" },
  { label: "Créditos", href: "#creditos" },
  { label: "FAQ", href: "#faq" },
] as const;

const CTA_LABEL = "Falar com um especialista";
const SCROLL_THRESHOLD = 80;

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="group relative py-1 text-sm text-fg/90 transition-colors hover:text-fg"
    >
      {children}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-red transition-transform duration-[180ms] ease-[var(--ease-brand)] group-hover:scale-x-100 motion-reduce:transition-none" />
    </a>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Sheet lifecycle: lock scroll, trap focus, close on Escape/backdrop.
  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    const focusable = () =>
      sheet
        ? Array.from(sheet.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"))
        : [];

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    focusable()[0]?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav
          aria-label="Navegação principal"
          className={`flex w-full max-w-3xl items-center justify-between gap-4 rounded-full border border-border backdrop-blur-xl transition-all duration-200 ease-[var(--ease-brand)] ${
            scrolled ? "bg-bg/72 px-4 py-2" : "bg-bg/20 px-6 py-3"
          }`}
        >
          <a href="#topo" aria-label="BMF Soluções, início" className="shrink-0">
            <img src="/brand/logo-branco.svg" alt="BMF Soluções" className="h-6 w-auto" />
          </a>

          <ul className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href}>{link.label}</NavLink>
              </li>
            ))}
          </ul>

          <motion.a
            href="#contato"
            className="hidden shrink-0 rounded-full bg-red px-5 py-2 text-sm font-medium text-fg md:inline-block"
            whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(241,77,65,0.45)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {CTA_LABEL}
          </motion.a>

          <button
            ref={triggerRef}
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="nav-sheet"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-fg md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="fixed inset-0 z-50 flex flex-col bg-bg/98 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <img src="/brand/logo-branco.svg" alt="BMF Soluções" className="h-6 w-auto" />
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={close}
                className="flex h-11 w-11 items-center justify-center rounded-full text-fg"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="flex flex-1 flex-col items-center justify-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.1 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  }}
                  exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                >
                  <a href={link.href} onClick={close} className="font-display text-3xl text-fg">
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 16 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.1 + NAV_LINKS.length * 0.05,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
                exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
              >
                <a
                  href="#contato"
                  onClick={close}
                  className="mt-4 inline-block rounded-full bg-red px-8 py-3 text-base font-medium text-fg"
                >
                  {CTA_LABEL}
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
