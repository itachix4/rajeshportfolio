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
    id: "forgelane",
    index: "001",
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
    accent: "#ff6a00",
    surface: "#0a0a0a",
  },
];
