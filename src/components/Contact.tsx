import { MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:contact@parthparwani.com" data-cursor="disable">
                contact@parthparwani.com
              </a>
            </p>
            <h4>Education</h4>
            <p>Class 12 Student (PCM)</p>
          </div>

          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Parth Parwani</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
