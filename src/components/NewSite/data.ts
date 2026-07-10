const baseUrl = import.meta.env.BASE_URL;

export const CONTACT_EMAIL = "contact@parthparwani.com";

export const ROLES = ["Entrepreneur", "Designer", "Developer"];

export const ABOUT_STATEMENT =
  "I build digital ideas across tech, branding, finance, and business.";

export const ABOUT_CHIPS = [
  "Entrepreneur",
  "Designer",
  "Developer",
  "Class 12 · PCM",
];

export const SERVICES = [
  {
    title: "Digital Identities",
    description:
      "I build digital identities, social media creatives, and brand communication that feel modern, clean, and impactful.",
    tags: ["Branding", "Content Strategy", "Social Media", "Positioning"],
  },
  {
    title: "Sleek UI & Performance",
    description:
      "I create portfolio sites, startup landing pages, and business websites with a focus on sleek UI, performance, and storytelling.",
    tags: ["Web Design", "Development", "UI/UX", "Storytelling"],
  },
];

export const PROJECTS = [
  {
    title: "FinanceForTeens",
    category: "Making finance easier and more relatable for teenagers.",
    tools: ["Brand Strategy", "UI Design", "Content Direction", "Web Concept"],
    image: `${baseUrl}images/work-financeforteens.jpg`,
  },
  {
    title: "Krish Veneer",
    category:
      "Building a stronger digital presence for a premium veneer business.",
    tools: [
      "Branding",
      "Social Media",
      "Business Positioning",
      "Website Direction",
    ],
    image: `${baseUrl}images/work-krishveneer.jpg`,
  },
  {
    title: "Personal Portfolio",
    category: "A digital space that reflects my work, mindset, and journey.",
    tools: ["Next.js", "UI/UX", "Responsive Design", "Personal Branding"],
    image: `${baseUrl}images/work-portfolio.jpg`,
  },
  {
    title: "Startup / Creative Experiments",
    category: "Concepts, visuals, and mini-projects exploring design.",
    tools: [
      "Creative Direction",
      "Design Systems",
      "Experimentation",
      "Prototyping",
    ],
    image: `${baseUrl}images/work-experiments.jpg`,
  },
];

export const CAREER = [
  {
    year: "2023",
    title: "Learning & Exploration",
    description:
      "Started learning design, branding, and digital creativity. Began understanding how strong visuals and online presence can shape a business.",
  },
  {
    year: "2024",
    title: "Building & Creating",
    description:
      "Worked on personal projects, business ideas, and online brand building. Started focusing seriously on tech, entrepreneurship, and finance education.",
  },
  {
    year: "NOW",
    title: "Digital Experiences",
    description:
      "Building modern digital experiences while exploring entrepreneurship, finance education, and technology. Currently working on ideas around branding and digital products.",
  },
];

export const TECH_ROW_ONE = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
];

export const TECH_ROW_TWO = [
  "MongoDB",
  "MySQL",
  "Express",
  "Framer Motion",
  "Figma",
  "Branding",
];
