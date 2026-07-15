export type AssistantAction = {
  label: string;
  href: string;
};

export type PortfolioAnswer = {
  text: string;
  action?: AssistantAction;
};

type KnowledgeEntry = {
  id: string;
  terms: string[];
  answer: PortfolioAnswer;
};

export const SUGGESTED_QUESTIONS = [
  "Why should I hire you?",
  "Tell me about ForgeLane.",
  "What technologies do you use?",
  "How do you approach animation?",
  "What are you building now?",
  "Show me your favourite project.",
];

const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "hire",
    terms: ["hire", "different", "choose", "strength", "valuable", "work with you"],
    answer: {
      text: "Parth combines three roles that are usually separated: founder-level product thinking, high-end interface design and production engineering. That means fewer handoffs, a clearer idea and a final experience whose strategy, visuals and code actually agree. He is 17, but the useful signal is that he is already shipping, founding and thinking in systems.",
      action: { label: "Start a project", href: "mailto:contact@parthparwani.com" },
    },
  },
  {
    id: "forgelane",
    terms: ["forgelane", "forge lane", "studio", "company", "venture", "founder"],
    answer: {
      text: "ForgeLane is the premium digital studio Parth founded. He developed its positioning, identity, UI direction, motion language and production build as one connected system. The aim is deliberately not to resemble a typical software agency: it should feel sharp, authored and commercially useful.",
      action: { label: "Explore the ForgeLane case", href: "#work" },
    },
  },
  {
    id: "technology",
    terms: ["technology", "technologies", "tech", "stack", "code", "framework", "tools", "typescript", "react", "next"],
    answer: {
      text: "His core stack is Next.js, React, TypeScript, Tailwind CSS, Motion, Three.js and Vercel. He also works across Node.js, modern AI-assisted workflows, design systems, accessibility, SEO and performance. The important part is how he uses the stack: heavy experiences are lazy-loaded, WebGL is adaptive and motion always has a reduced fallback.",
      action: { label: "Open the technical Lab", href: "/lab" },
    },
  },
  {
    id: "hardest",
    terms: ["hardest", "difficult", "challenge", "complex", "problem"],
    answer: {
      text: "The recurring hard problem is balancing ambition with restraint: making an experience technically impressive without making it slower, harder to use or visually noisy. ForgeLane sharpened that skill because Parth had to make strategy, identity, interface and engineering reinforce one positioning idea.",
      action: { label: "Inspect the project", href: "#work" },
    },
  },
  {
    id: "krish-veneer",
    terms: ["krish", "veneer", "plywood", "liberia", "forest", "flagship"],
    answer: {
      text: "Krish Veneer is Parth's flagship brand experience for a premium veneer and plywood manufacturer in Liberia. The design turns material quality, legal sourcing and an eight-stage craft process into a cinematic product narrative without losing industrial credibility.",
      action: { label: "View Krish Veneer", href: "https://krishveneer.com" },
    },
  },
  {
    id: "north-star",
    terms: ["north star", "northstar", "metal", "recycling", "scrap"],
    answer: {
      text: "North Star is an industrial brand platform for a metal trading and recycling company operating across West Africa. Parth organised sourcing, processing, logistics and sustainability into a direct service story designed to build trust and lead people toward contact.",
      action: { label: "View North Star", href: "https://northstarlib.com" },
    },
  },
  {
    id: "finance-for-teens",
    terms: ["financeforteen", "finance for teen", "finance for teens", "finance", "teens", "education", "financial education"],
    answer: {
      text: "FinanceForTeen teaches the money lessons school leaves out—from investing and budgeting to taxes, credit and markets. Parth shaped it as a bold editorial learning product that treats teenagers like capable future decision-makers.",
      action: { label: "View FinanceForTeen", href: "https://financeforteen.com" },
    },
  },
  {
    id: "favourite",
    terms: ["favourite", "favorite", "best project", "show project", "work"],
    answer: {
      text: "Krish Veneer is the strongest expression of Parth's current web craft: a premium material story translated into art direction, information hierarchy, motion and frontend execution. ForgeLane is the wider expression of his founder mindset, so the two projects show different sides of the same practice.",
      action: { label: "Explore selected work", href: "#work" },
    },
  },
  {
    id: "now",
    terms: ["building now", "currently", "now", "today", "working on", "next"],
    answer: {
      text: "Right now Parth is growing ForgeLane, refining this portfolio as a real interactive product and building experiments across motion, WebGL, AI-assisted interfaces and reusable UI systems. The Lab is where that technical research stays visible.",
      action: { label: "Enter PARTH LAB OS", href: "/lab" },
    },
  },
  {
    id: "process",
    terms: ["process", "design process", "workflow", "how do you design", "design method"],
    answer: {
      text: "Parth starts by clarifying the audience, positioning and single idea the product needs to communicate. He then reduces the experience to its essential hierarchy, defines a visual and motion system, prototypes the riskiest interaction early and engineers reusable components around real content. Performance and accessibility are reviewed as design qualities, not cleanup tasks.",
    },
  },
  {
    id: "animation",
    terms: ["animation", "motion", "three.js", "webgl", "3d", "interaction", "gsap", "framer"],
    answer: {
      text: "Motion should explain cause and effect. Parth uses spring-based UI transitions for spatial continuity, scroll-linked values when movement needs narrative meaning and custom WebGL or GLSL only when depth adds something the DOM cannot. He caps pixel ratio, avoids React renders inside frame loops, animates transforms and opacity, and ships reduced-motion plus low-power fallbacks.",
      action: { label: "See live experiments", href: "/lab" },
    },
  },
  {
    id: "lab",
    terms: ["lab", "experiment", "research", "prototype", "parth lab os"],
    answer: {
      text: "PARTH LAB OS is a separate technical playground presented as an experimental mobile operating system. It contains motion, AI, 3D, interface and live-build research, with custom shader pieces and visible engineering notes. It exists to prove implementation depth—not to inflate the client-work list.",
      action: { label: "Open Lab OS", href: "/lab" },
    },
  },
  {
    id: "age",
    terms: ["age", "17", "young", "student", "school"],
    answer: {
      text: "Parth is 17 and studying PCM while founding ForgeLane and shipping production work. He treats that as an advantage: the curiosity to learn quickly, the energy to explore new tools and enough real delivery experience to know that craft has to survive contact with users.",
    },
  },
  {
    id: "contact",
    terms: ["contact", "email", "available", "project", "budget", "start", "collaborate"],
    answer: {
      text: "Parth is available for select projects where strategy, interface quality and engineering all matter. The fastest way to start is to email contact@parthparwani.com with what you are building, why it matters and the outcome you want.",
      action: { label: "Email Parth", href: "mailto:contact@parthparwani.com" },
    },
  },
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9\s.-]/g, " ");

export const answerPortfolioQuestion = (question: string): PortfolioAnswer => {
  const normalizedQuestion = normalize(question);
  let bestMatch: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE) {
    const score = entry.terms.reduce(
      (total, term) => total + (normalizedQuestion.includes(term) ? Math.max(1, term.split(" ").length) : 0),
      0,
    );
    if (score > bestScore) {
      bestMatch = entry;
      bestScore = score;
    }
  }

  if (bestMatch) return bestMatch.answer;

  return {
    text: "I only answer from Parth's verified portfolio knowledge, so I may not have that information yet. Ask me about his stack, ForgeLane, design process, motion approach, current work, technical Lab or why he could be right for your project.",
  };
};
