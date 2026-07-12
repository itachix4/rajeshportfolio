export const PROFILE = {
  name: "Parth Parwani",
  initials: "PP",
  email: "contact@parthparwani.com",
  age: 17,
  education: "Class 12 · PCM student",
  availability: "Available for select projects",
  headline: "I build digital experiences people remember.",
  introduction:
    "I’m a full-stack developer, designer and entrepreneur creating premium websites, brands and modern products for ambitious ideas.",
};

export const CONTACT_EMAIL = PROFILE.email;

export const NAV_LINKS = [
  { label: "Work", target: "#work" },
  { label: "About", target: "#about" },
  { label: "Capabilities", target: "#capabilities" },
  { label: "Journey", target: "#journey" },
];

export const SIGNALS = [
  "Full-stack development",
  "UI/UX design",
  "Brand identity",
  "Motion & interaction",
  "AI-assisted development",
  "Performance optimization",
];

export type Project = {
  number: string;
  title: string;
  eyebrow: string;
  problem: string;
  outcome: string;
  role: string;
  stack: string[];
  url?: string;
};

export const PROJECTS: Project[] = [
  {
    number: "01",
    title: "ForgeLane",
    eyebrow: "Founder · Premium digital studio",
    problem:
      "Digital studios often blur into the same visual and verbal language, making it harder for ambitious brands to choose with confidence.",
    outcome:
      "Built a distinctive studio brand and production-ready web presence that brings strategy, identity, interface and delivery into one system.",
    role: "Founder · Strategy · Brand direction · UI/UX · Full-stack delivery",
    stack: ["React", "TypeScript", "Motion", "Vercel"],
    url: "https://forgelane.vercel.app",
  },
];

export const PRINCIPLES = [
  {
    number: "01",
    title: "Craft over templates",
    description:
      "Every layout, interaction and transition should earn its place. Premium work feels intentional at every scale.",
  },
  {
    number: "02",
    title: "Performance is part of design",
    description:
      "A beautiful experience that feels slow is unfinished. Speed, accessibility and polish belong in the same system.",
  },
  {
    number: "03",
    title: "Build with a founder’s lens",
    description:
      "The goal is not merely a website. It is a stronger brand, clearer product and a reason for people to care.",
  },
];

export const CAPABILITIES = [
  {
    number: "01",
    title: "Strategy & identity",
    description:
      "Clarify the audience, message and story so the idea has a reason to matter.",
    tags: ["Positioning", "Brand identity", "Creative direction", "Content"],
    icon: "compass",
  },
  {
    number: "02",
    title: "UI/UX & motion",
    description:
      "Turn the strategy into a visual system and interface that feels distinct and easy to use.",
    tags: ["Product design", "UI systems", "Prototyping", "Interaction"],
    icon: "pen",
  },
  {
    number: "03",
    title: "Full-stack development",
    description:
      "Develop fast, accessible websites and modern web applications that are built to ship.",
    tags: ["Next.js", "React", "TypeScript", "Vercel"],
    icon: "code",
  },
];

export const JOURNEY = [
  {
    year: "START",
    title: "Curiosity became a skill set",
    description:
      "Started combining code, design and branding—learning how each discipline makes the others more useful.",
  },
  {
    year: "BUILD",
    title: "Skills became real projects",
    description:
      "Turned design and development skills into real websites, brand systems and product experiments while exploring modern AI tools.",
  },
  {
    year: "NOW",
    title: "Founder mode: ForgeLane",
    description:
      "Growing a premium digital studio while studying PCM and continuing to build at the intersection of technology, design and business.",
  },
];

export const WORKBENCH_MODES = [
  {
    id: "engineer",
    index: "01",
    label: "Engineer",
    prompt: "Ship the product",
    title: "Production-minded from the first component.",
    description:
      "I turn ambitious interfaces into fast, accessible systems that stay clean when the product grows.",
    skills: [
      {
        name: "Full-stack systems",
        detail:
          "Typed components, clear data flows and modular architecture designed for real deployment—not just the demo.",
        tools: ["Next.js", "React", "TypeScript", "Node.js"],
        outcome: "A maintainable product that is ready to ship and easy to extend.",
      },
      {
        name: "Performance engineering",
        detail:
          "I treat loading, responsiveness and runtime behavior as visible parts of the brand experience.",
        tools: ["Vercel", "Core Web Vitals", "Lighthouse", "SEO"],
        outcome: "An experience that feels immediate on mobile and desktop.",
      },
      {
        name: "Interaction development",
        detail:
          "Motion is built around intent: guiding attention, explaining state and making the interface feel physical.",
        tools: ["Framer Motion", "WebGL", "CSS", "Accessibility"],
        outcome: "Memorable interaction without sacrificing usability or speed.",
      },
    ],
  },
  {
    id: "designer",
    index: "02",
    label: "Designer",
    prompt: "Shape the identity",
    title: "A visual system with a point of view.",
    description:
      "I connect brand, interface and motion so the final experience feels like one authored idea.",
    skills: [
      {
        name: "Product UI/UX",
        detail:
          "Flows are simplified before pixels are polished, keeping the interface clear even when the product is complex.",
        tools: ["Figma", "Wireframes", "Prototyping", "Design systems"],
        outcome: "A product people understand quickly and enjoy returning to.",
      },
      {
        name: "Brand identity",
        detail:
          "Positioning, typography, color and composition are shaped into a distinct digital language.",
        tools: ["Art direction", "Typography", "Identity", "Content"],
        outcome: "A brand presence that is recognizable without relying on trends.",
      },
      {
        name: "Motion direction",
        detail:
          "Transitions and micro-interactions establish rhythm, hierarchy and a tactile sense of quality.",
        tools: ["Motion studies", "Framer Motion", "Storyboards", "WebGL"],
        outcome: "Movement that makes the idea clearer—not merely louder.",
      },
    ],
  },
  {
    id: "founder",
    index: "03",
    label: "Founder",
    prompt: "Make it matter",
    title: "Every decision tied back to the business.",
    description:
      "Building ForgeLane taught me to think past the deliverable: audience, positioning, value and what happens after launch.",
    skills: [
      {
        name: "Product thinking",
        detail:
          "I question what should be built, who it serves and which experience will create the clearest advantage.",
        tools: ["Research", "Prioritization", "User journeys", "MVP strategy"],
        outcome: "Less noise, stronger decisions and a more useful product.",
      },
      {
        name: "Creative strategy",
        detail:
          "The central idea is defined before the visual system, giving every page and interaction a reason to exist.",
        tools: ["Positioning", "Messaging", "Creative direction", "Brand systems"],
        outcome: "A digital presence that communicates value before it explains features.",
      },
      {
        name: "AI-assisted delivery",
        detail:
          "Modern AI tools accelerate exploration, implementation and quality checks while judgment stays human.",
        tools: ["AI workflows", "Rapid prototyping", "QA", "Automation"],
        outcome: "Faster iteration without lowering the craft standard.",
      },
    ],
  },
] as const;

export const CONTACT_TOPICS = ["A premium website", "A brand identity", "A web application", "Something ambitious"];

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/itachix4" },
  { label: "ForgeLane", href: "https://forgelane.vercel.app" },
];
