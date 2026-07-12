import { ArrowUpRight } from "lucide-react";

const MarqueeBand = () => (
  <aside className="proof-strip" aria-label="Professional proof points">
    <div className="portfolio-container proof-strip__inner">
      <p className="proof-strip__label">Built, not just imagined</p>
      <dl className="proof-strip__facts">
        <div><dt>Founder</dt><dd>ForgeLane</dd></div>
        <div><dt>Delivery</dt><dd>Strategy → production</dd></div>
        <div><dt>Core stack</dt><dd>React · TypeScript · Vercel</dd></div>
      </dl>
      <a href="https://forgelane.vercel.app" target="_blank" rel="noreferrer">
        View the live venture
        <ArrowUpRight size={15} aria-hidden="true" />
      </a>
    </div>
  </aside>
);

export default MarqueeBand;
