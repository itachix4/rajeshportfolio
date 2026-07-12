import type { LabSceneKind } from "./LabScene";

export type LabStatus = "Live" | "Building" | "Beta" | "Archived";
export type LabIcon = "motion" | "ai" | "cube" | "systems" | "forge" | "live" | "archive" | "about";
export type LabPreview = "waves" | "neural" | "volume" | "tokens" | "forge" | "terminal" | "archive" | "identity";

export type LabApp = {
  id: string;
  number: string;
  title: string;
  icon: LabIcon;
  description: string;
  status: LabStatus;
  progress: number;
  updatedAt: string;
  technologies: string[];
  preview: LabPreview;
  challenge: string;
  learning: string;
  liveUrl: string;
  codeUrl: string;
  liveScene?: LabSceneKind;
};

const REPOSITORY = "https://github.com/itachix4/rajeshportfolio";

export const LAB_APPS: LabApp[] = [
  {
    id: "motion-lab",
    number: "EXP–01",
    title: "Motion Lab",
    icon: "motion",
    description: "Spring choreography, scroll-linked systems and interaction physics built for the portfolio.",
    status: "Live",
    progress: 100,
    updatedAt: "13 Jul 2026",
    technologies: ["Motion", "React", "R3F", "TypeScript"],
    preview: "waves",
    liveScene: "particles",
    challenge: "Make technically rich movement feel intentional without turning the interface into a motion demo reel.",
    learning: "One shared MotionValue can coordinate DOM and WebGL while avoiding React renders inside the animation loop.",
    liveUrl: "/#top",
    codeUrl: `${REPOSITORY}/tree/main/src/components/NewHero`,
  },
  {
    id: "ai-experiments",
    number: "EXP–02",
    title: "AI Experiments",
    icon: "ai",
    description: "Small research prototypes for prompt systems, structured generation and human-in-the-loop workflows.",
    status: "Building",
    progress: 68,
    updatedAt: "12 Jul 2026",
    technologies: ["TypeScript", "AI workflows", "Automation", "Evaluation"],
    preview: "neural",
    liveScene: "reaction",
    challenge: "Keep experimental AI behavior inspectable and useful instead of hiding uncertainty behind a polished interface.",
    learning: "Good AI products need visible state, bounded outputs and thoughtful evaluation more than another chat box.",
    liveUrl: "/lab",
    codeUrl: REPOSITORY,
  },
  {
    id: "3d-playground",
    number: "EXP–03",
    title: "3D Playground",
    icon: "cube",
    description: "Custom GLSL, signed-distance fields and GPU experiments rendered live in the browser.",
    status: "Live",
    progress: 92,
    updatedAt: "13 Jul 2026",
    technologies: ["Three.js", "R3F", "GLSL", "WebGL2"],
    preview: "volume",
    liveScene: "raymarch",
    challenge: "Deliver a memorable real-time scene while staying inside the thermal and download budget of a portfolio.",
    learning: "Shader math is often cheaper than assets: an SDF scene can create depth with zero model or texture downloads.",
    liveUrl: "/#top",
    codeUrl: `${REPOSITORY}/blob/main/src/components/Lab/LabScene.tsx`,
  },
  {
    id: "ui-systems",
    number: "EXP–04",
    title: "UI Systems",
    icon: "systems",
    description: "A living set of tokens, interaction rules and accessible components for authored interfaces.",
    status: "Beta",
    progress: 84,
    updatedAt: "11 Jul 2026",
    technologies: ["React", "CSS", "Design tokens", "Accessibility"],
    preview: "tokens",
    challenge: "Create repeatable structure without sanding away the personality that makes a designed product recognizable.",
    learning: "The strongest systems standardize decisions and behavior, not every visual outcome.",
    liveUrl: "/#capabilities",
    codeUrl: `${REPOSITORY}/blob/main/src/site.css`,
  },
  {
    id: "forge-os",
    number: "EXP–05",
    title: "Forge OS",
    icon: "forge",
    description: "Product and operating-system concepts for running a focused, premium digital studio.",
    status: "Building",
    progress: 76,
    updatedAt: "10 Jul 2026",
    technologies: ["Product strategy", "React", "Systems", "Automation"],
    preview: "forge",
    challenge: "Turn a founder's changing process into a clear system without creating administrative overhead.",
    learning: "A useful operating system removes decisions from repeated work and preserves judgment for the work that matters.",
    liveUrl: "https://forgelane.vercel.app",
    codeUrl: REPOSITORY,
  },
  {
    id: "live-builds",
    number: "EXP–06",
    title: "Live Builds",
    icon: "live",
    description: "Production deployments, performance experiments and things currently running on the internet.",
    status: "Live",
    progress: 100,
    updatedAt: "13 Jul 2026",
    technologies: ["Vercel", "Git", "CI/CD", "Core Web Vitals"],
    preview: "terminal",
    challenge: "Keep ambitious interfaces reliable when the environment, network and device are outside my control.",
    learning: "Progressive enhancement is not a fallback task; it is part of the product architecture from the first commit.",
    liveUrl: "/",
    codeUrl: REPOSITORY,
  },
  {
    id: "archive",
    number: "EXP–07",
    title: "Archive",
    icon: "archive",
    description: "Retired studies, discarded directions and technical ideas worth keeping visible.",
    status: "Archived",
    progress: 100,
    updatedAt: "08 Jul 2026",
    technologies: ["Prototypes", "Studies", "Iterations", "Notes"],
    preview: "archive",
    challenge: "Preserve the useful thinking inside abandoned work without presenting every experiment as a finished product.",
    learning: "Discarded directions make future judgment faster when the reasoning—not only the screenshot—is retained.",
    liveUrl: "https://github.com/itachix4",
    codeUrl: "https://github.com/itachix4",
  },
  {
    id: "about-lab",
    number: "EXP–08",
    title: "About Lab",
    icon: "about",
    description: "Why this space exists and how experimental code becomes production craft.",
    status: "Live",
    progress: 100,
    updatedAt: "13 Jul 2026",
    technologies: ["Curiosity", "Engineering", "Design", "Iteration"],
    preview: "identity",
    challenge: "Show raw technical range without letting the laboratory compete with the clarity of the main portfolio.",
    learning: "The experiment is valuable when it changes how the next real product is designed or engineered.",
    liveUrl: "/#about",
    codeUrl: `${REPOSITORY}/tree/main/src/components/Lab`,
  },
];
