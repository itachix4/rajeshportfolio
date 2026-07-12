import type { Metadata } from "next";
import App from "../../src/App";

export const metadata: Metadata = {
  title: "PARTH LAB OS — Interactive Experiments by Parth Parwani",
  description:
    "Open PARTH LAB OS, an interactive mobile operating system for Parth Parwani's experiments, prototypes and live WebGL research.",
  alternates: { canonical: "/lab" },
  openGraph: {
    title: "PARTH LAB OS — Interactive Experiments",
    description: "Motion, AI, WebGL, UI systems and live-build research inside a custom experimental OS.",
    url: "/lab",
  },
};

export default function LabRoute() {
  return <App pathname="/lab" />;
}
