import { SIGNALS } from "./data";

const MarqueeBand = () => (
  <aside className="signal-band" aria-label="Areas of expertise">
    <div className="portfolio-container">
      <p className="signal-band__label">What I bring</p>
      <ul className="signal-band__list">
        {SIGNALS.map((signal, index) => (
          <li key={signal}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {signal}
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

export default MarqueeBand;
