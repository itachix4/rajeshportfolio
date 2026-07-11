import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { CONTACT_EMAIL, NAV_LINKS, PROFILE } from "../NewSite/data";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const HeroNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const pageRegions = [
      document.getElementById("main-content"),
      document.querySelector<HTMLElement>(".contact-footer"),
    ].filter((region): region is HTMLElement => Boolean(region));

    document.body.style.overflow = "hidden";
    pageRegions.forEach((region) => {
      region.inert = true;
      region.setAttribute("aria-hidden", "true");
    });

    const getFocusable = () =>
      Array.from(headerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (element) => element.offsetParent !== null
      );

    const focusTimer = window.setTimeout(() => {
      const menuLink = headerRef.current?.querySelector<HTMLElement>(
        "#mobile-navigation a"
      );
      menuLink?.focus();
    }, 30);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      pageRegions.forEach((region) => {
        region.inert = false;
        region.removeAttribute("aria-hidden");
      });
      previouslyFocused?.focus();
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={`site-header${scrolled || menuOpen ? " site-header--active" : ""}`}
    >
      <div className="site-header__inner portfolio-container">
        <a className="brand-mark" href="#top" aria-label={`${PROFILE.name}, home`}>
          <span className="brand-mark__monogram" aria-hidden="true">
            PP
          </span>
          <span className="brand-mark__name">Parth Parwani</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <a key={link.target} href={link.target}>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href={`mailto:${CONTACT_EMAIL}`}>
          Let&apos;s talk
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="mobile-menu__nav" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, index) => (
                <motion.a
                  key={link.target}
                  href={link.target}
                  onClick={closeMenu}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: index * 0.04 }}
                >
                  <span>0{index + 1}</span>
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="mobile-menu__footer">
              <p>Founder of ForgeLane</p>
              <a href={`mailto:${CONTACT_EMAIL}`} onClick={closeMenu}>
                {CONTACT_EMAIL}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HeroNavbar;
