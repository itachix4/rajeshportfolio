export type PortfolioProject = {
  id: string;
  index: string;
  title: string;
  year: string;
  category: string;
  image: string;
  liveUrl: string;
  summary: string;
  challenge: string;
  outcome: string;
  role: string;
  services: string[];
  stack: string[];
  accent: string;
  surface: string;
};

export const PROJECTS: PortfolioProject[] = [
  {
    id: "krish-veneer",
    index: "001",
    title: "Krish Veneer",
    year: "2026",
    category: "Flagship brand experience",
    image: "/images/projects/krish-veneer.jpg",
    liveUrl: "https://krishveneer.com",
    summary: "A cinematic digital home for premium plywood, veneer and a traceable craft process in Liberia.",
    challenge:
      "Make industrial manufacturing feel refined without losing the credibility of the material, sourcing and production story.",
    outcome:
      "The experience turns an eight-stage manufacturing process, a considered product collection and legal sourcing into one confident narrative.",
    role: "Design direction · UI engineering",
    services: ["Art direction", "Experience design", "Frontend development", "Motion system"],
    stack: ["Next.js", "TypeScript", "Motion", "Vercel"],
    accent: "#d9a65f",
    surface: "#101411",
  },
  {
    id: "north-star",
    index: "002",
    title: "North Star",
    year: "2026",
    category: "Industrial brand platform",
    image: "/images/projects/north-star.jpg",
    liveUrl: "https://northstarlib.com",
    summary: "A clear, high-trust platform for a metal trading and recycling business operating across West Africa.",
    challenge:
      "Organise a broad story spanning sourcing, processing, logistics and sustainability without making it feel like a corporate brochure.",
    outcome:
      "A direct service architecture moves visitors from industrial capability to process, proof and contact with far less friction.",
    role: "Product strategy · Design · Development",
    services: ["Information architecture", "Visual system", "Responsive UI", "Conversion flow"],
    stack: ["React", "TypeScript", "Responsive UI", "Vercel"],
    accent: "#91c4e8",
    surface: "#0c1d2d",
  },
  {
    id: "finance-for-teens",
    index: "003",
    title: "Finance for Teens",
    year: "2025",
    category: "Education platform",
    image: "/images/projects/finance-for-teens.jpg",
    liveUrl: "https://financeforteens.com",
    summary: "A friendly financial education platform that makes money fundamentals approachable for younger learners.",
    challenge:
      "Turn a serious subject into something welcoming for teenagers while keeping the offer understandable for parents and schools.",
    outcome:
      "Courses, bootcamps and after-school programmes become easy to scan, compare and act on through a simple content-led journey.",
    role: "Website design · Content structure",
    services: ["Audience framing", "Content design", "Interface design", "Responsive build"],
    stack: ["Responsive web", "CMS", "Content systems"],
    accent: "#37c8bc",
    surface: "#e9f4ee",
  },
  {
    id: "forgelane",
    index: "004",
    title: "ForgeLane",
    year: "2026",
    category: "Founder-led studio system",
    image: "/images/projects/forgelane.jpg",
    liveUrl: "https://forgelane.vercel.app",
    summary: "The identity and digital front door for a studio building websites beyond the ordinary.",
    challenge:
      "Express a premium, founder-led practice without falling into the familiar agency-template language the studio exists to replace.",
    outcome:
      "A restrained monochrome identity, sharp typography and selective gold details make the positioning immediate and ownable.",
    role: "Founder · Brand · Product",
    services: ["Brand strategy", "Creative direction", "Design system", "Frontend"],
    stack: ["Next.js", "TypeScript", "Motion", "Vercel"],
    accent: "#dfb865",
    surface: "#0a0a0a",
  },
  {
    id: "lab-os",
    index: "005",
    title: "PARTH LAB OS",
    year: "Ongoing",
    category: "Experimental product",
    image: "/images/projects/lab-os.jpg",
    liveUrl: "/lab",
    summary: "A browser-based operating system where unfinished ideas become interactive engineering experiments.",
    challenge:
      "Show technical range through things people can use—not claims, skill bars or another gallery of static cards.",
    outcome:
      "Eight distinct mini-products turn motion, shaders, design systems, deployment and runtime architecture into tangible proof.",
    role: "Concept · Design · Engineering",
    services: ["Product concept", "Interaction systems", "Creative coding", "Performance"],
    stack: ["React", "Canvas", "WebGL", "Motion"],
    accent: "#ff6a00",
    surface: "#101010",
  },
];
