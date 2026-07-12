import { ArrowUp, ArrowUpRight } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_TOPICS, PROFILE, SOCIAL_LINKS } from "./data";
import { Reveal } from "./Reveal";

const topicHref = (topic: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Project inquiry — ${topic}`)}`;

const ContactFooter = () => (
  <footer id="contact" className="contact-footer">
    <div className="contact-orbit" aria-hidden="true" />
    <div className="portfolio-container">
      <Reveal className="contact-heading">
        <span>06 / Start something</span>
        <h2>
          Have a product or brand
          <em> that needs to ship?</em>
        </h2>
      </Reveal>

      <div className="contact-layout">
        <Reveal className="contact-primary">
          <p>
            Send the brief, the constraint and the ambition. I&apos;ll reply with a
            clear next step—not a generic sales sequence.
          </p>
          <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
            <ArrowUpRight size={28} aria-hidden="true" />
          </a>
        </Reveal>

        <Reveal delay={0.08} className="contact-topics">
          <p>What are we building?</p>
          <div>
            {CONTACT_TOPICS.map((topic) => (
              <a key={topic} href={topicHref(topic)}>
                {topic}
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="footer-bottom">
        <div>
          <strong>{PROFILE.name}</strong>
          <p>
            &copy; {new Date().getFullYear()} · Designed and built with intent.
          </p>
        </div>
        <nav aria-label="Social and project links">
          {SOCIAL_LINKS.map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
        <a className="back-to-top" href="#top">
          Back to top
          <ArrowUp size={16} aria-hidden="true" />
        </a>
      </div>
    </div>
  </footer>
);

export default ContactFooter;
