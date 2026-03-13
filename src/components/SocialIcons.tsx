import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  return (
    <div className="icons-section">
      <a className="resume-button" href="#">
        <HoverLinks text="PROFILE" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
