import Marquee from "react-fast-marquee";
import { useReducedMotion } from "motion/react";
import { ROLES } from "./data";

/** Kinetic type band separating the hero from the content sections. */
const MarqueeBand = () => {
  const reducedMotion = useReducedMotion();
  const items = [...ROLES, "Based in India", "Open to ideas"];

  return (
    <div className="relative overflow-hidden py-8 md:py-10 bg-[#0D120E]">
      <p className="sr-only">{items.join(", ")}</p>
      <div
        aria-hidden="true"
        className="bg-[#A8C69F] text-[#0D120E] py-4 md:py-5 select-none -mx-4 -rotate-[1.5deg]"
      >
      <Marquee speed={44} autoFill play={!reducedMotion}>
        {items.map((item) => (
          <span
            key={item}
            className="flex items-center text-lg md:text-2xl font-medium tracking-tight"
          >
            <span className="mx-6 md:mx-10">{item}</span>
            <span className="text-[#4D6D47]">&#10033;</span>
          </span>
        ))}
      </Marquee>
      </div>
    </div>
  );
};

export default MarqueeBand;
