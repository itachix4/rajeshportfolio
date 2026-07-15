import { lazy, type ComponentType } from "react";
import type { LabAppId } from "../labData";
import type { LabApplicationProps } from "../runtime/LabAppTypes";

const MotionLab = lazy(() => import("./motion/MotionLab"));
const GenerativeInterface = lazy(() => import("./ai/GenerativeInterface"));
const ShaderForge = lazy(() => import("./shader/ShaderForge"));
const SystemStressTest = lazy(() => import("./systems/SystemStressTest"));
const ForgeOS = lazy(() => import("./forge/ForgeOS"));
const DeploymentHeist = lazy(() => import("./deploy/DeploymentHeist"));
const ArchiveMachine = lazy(() => import("./archive/ArchiveMachine"));
const SkillMap = lazy(() => import("./about/SkillMap"));
const CoreApp = lazy(() => import("./core/CoreApp"));

const APPLICATIONS: Record<LabAppId, ComponentType<LabApplicationProps>> = {
  "motion-lab": MotionLab,
  "ai-experiments": GenerativeInterface,
  "3d-playground": ShaderForge,
  "ui-systems": SystemStressTest,
  "forge-os": ForgeOS,
  "live-builds": DeploymentHeist,
  archive: ArchiveMachine,
  "about-lab": SkillMap,
  core: CoreApp,
};

export const LabApplication = (props: LabApplicationProps) => {
  const Application = APPLICATIONS[props.app.id];
  return <Application {...props} />;
};
