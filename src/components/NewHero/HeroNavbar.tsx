import { useEffect, useState } from "react";
import { CONTACT_EMAIL } from "../NewSite/data";

const NAV_LINKS = [
  { label: "About", target: "#about" },
  { label: "Work", target: "#work" },
  { label: "Journey", target: "#career" },
  { label: "Contact", target: "#contact" },
];

/**
 * Fixed site header. Gains a glass backdrop once the page is scrolled so
 * links stay readable over section content.
 */
const HeroNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="font-sans antialiased">
      <header
        className={`fixed top-0 inset-x-0 z-20 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center transition-colors duration-300 ${
          scrolled && !isMobileMenuOpen
            ? "bg-white/80 backdrop-blur-md shadow-sm shadow-emerald-950/5"
            : "bg-transparent"
        }`}
      >
        <a href="#top" className="flex flex-row gap-3 items-center">
          <span className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium select-none">
            Parth Parwani&reg;
          </span>
          <span className="text-[25px] sm:text-[30px] text-black select-none tracking-[-0.02em] font-medium leading-none mb-1">
            &#10033;
          </span>
        </a>

        <nav className="hidden lg:flex flex-row text-[23px] text-black">
          {NAV_LINKS.map((link, index) => (
            <span key={link.label} className="flex flex-row">
              <a
                href={link.target}
                className="hover:opacity-60 transition-opacity"
              >
                {link.label}
              </a>
              {index < NAV_LINKS.length - 1 && (
                <span className="opacity-40">,&nbsp;</span>
              )}
            </span>
          ))}
        </nav>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="hidden lg:inline text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        <button
          type="button"
          className="lg:hidden relative z-10 flex flex-col justify-center items-center w-11 h-11 -mr-2 gap-[5px]"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </button>
      </header>

      {/* Mobile navigation overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[15] bg-white/95 backdrop-blur-sm transition-[opacity,visibility] duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <nav className="h-full flex flex-col justify-center items-start gap-6 px-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.target}
              className="text-4xl text-black tracking-tight hover:opacity-60 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-6 text-2xl text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Get in touch
          </a>
        </nav>
      </div>
    </div>
  );
};

export default HeroNavbar;
