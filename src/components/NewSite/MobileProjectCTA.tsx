import { ArrowUpRight } from "lucide-react";
import { CONTACT_EMAIL } from "./data";

const MobileProjectCTA = () => (
  <aside className="mobile-project-cta" aria-label="Project inquiry">
    <div>
      <span aria-hidden="true" />
      <p>Available for select projects</p>
    </div>
    <a href={`mailto:${CONTACT_EMAIL}?subject=Project%20inquiry`}>
      Start a project
      <ArrowUpRight size={15} aria-hidden="true" />
    </a>
  </aside>
);

export default MobileProjectCTA;
