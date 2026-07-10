import Marquee from "react-fast-marquee";
import { useReducedMotion } from "motion/react";
import { ROLES } from "./data";

/** Kinetic type band separating the hero from the content sections. */
const MarqueeBand = () => {
  const reducedMotion = useReducedMotion();
  const items = [...ROLES, "Based in India", "Open to ideas"];

  return (
    <div className="bg-[#1C2E1E] text-[#FAFBF9] py-4 md:py-5 select-none overflow-hidden">
      <p className="sr-only">{items.join(", ")}</p>
      <div aria-hidden="true">
      <Marquee speed={44} autoFill play={!reducedMotion}>
        {items.map((item) => (
          <span
            key={item}
            className="flex items-center text-lg md:text-2xl font-medium tracking-tight"
          >
            <span className="mx-6 md:mx-10">{item}</span>
            <span className="text-[#8FA98B]">&#10033;</span>
          </span>
        ))}
      </Marquee>
      </div>
    </div>
  );
};

export default MarqueeBand;
