export type LabStatus = "Live" | "Building" | "Beta" | "Archived" | "Locked";
export type LabIcon = "motion" | "ai" | "cube" | "systems" | "forge" | "live" | "archive" | "about" | "core";
export type LabPreview = "waves" | "neural" | "volume" | "tokens" | "forge" | "terminal" | "archive" | "identity" | "core";
export type LabAppId =
  | "motion-lab"
  | "ai-experiments"
  | "3d-playground"
  | "ui-systems"
  | "forge-os"
  | "live-builds"
  | "archive"
  | "about-lab"
  | "core";

export type LabApp = {
  id: LabAppId;
  number: string;
  title: string;
  icon: LabIcon;
  description: string;
  status: LabStatus;
  preview: LabPreview;
  clue?: boolean;
};

export const LAB_APPS: LabApp[] = [
  {
    id: "motion-lab",
    number: "EXP–01",
    title: "Motion Lab",
    icon: "motion",
    description: "Record a gesture, shape its physics and export production animation code.",
    status: "Live",
    preview: "waves",
    clue: true,
  },
  {
    id: "ai-experiments",
    number: "EXP–02",
    title: "AI Experiments",
    icon: "ai",
    description: "A deterministic interface fabrication machine with inspectable generation stages.",
    status: "Live",
    preview: "neural",
  },
  {
    id: "3d-playground",
    number: "EXP–03",
    title: "3D Playground",
    icon: "cube",
    description: "A node-based shader forge for building and inspecting materials in real time.",
    status: "Live",
    preview: "volume",
  },
  {
    id: "ui-systems",
    number: "EXP–04",
    title: "UI Systems",
    icon: "systems",
    description: "Stress-test one token system across six synchronized product interfaces.",
    status: "Beta",
    preview: "tokens",
  },
  {
    id: "forge-os",
    number: "EXP–05",
    title: "Forge OS",
    icon: "forge",
    description: "A keyboard-first command desktop with interconnected production tools.",
    status: "Live",
    preview: "forge",
    clue: true,
  },
  {
    id: "live-builds",
    number: "EXP–06",
    title: "Live Builds",
    icon: "live",
    description: "A timed production incident where every engineering decision changes the deploy.",
    status: "Live",
    preview: "terminal",
    clue: true,
  },
  {
    id: "archive",
    number: "EXP–07",
    title: "Archive",
    icon: "archive",
    description: "Scrub through abandoned prototypes, branches and ideas that survived into later work.",
    status: "Archived",
    preview: "archive",
    clue: true,
  },
  {
    id: "about-lab",
    number: "EXP–08",
    title: "About Lab",
    icon: "about",
    description: "A data-driven capability graph that reshapes itself around the role you need.",
    status: "Live",
    preview: "identity",
    clue: true,
  },
];

export const CORE_APP: LabApp = {
  id: "core",
  number: "SYS–00",
  title: "CORE",
  icon: "core",
  description: "A live architectural instrument wired into the portfolio runtime itself.",
  status: "Live",
  preview: "core",
};
