import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Learning & Exploration</h4>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Started learning design, branding, and digital creativity. Began understanding how strong visuals and online presence can shape a business.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Building & Creating</h4>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Worked on personal projects, business ideas, and online brand building. Started focusing seriously on tech, entrepreneurship, and finance education.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Digital Experiences</h4>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Building modern digital experiences while exploring entrepreneurship, finance education, and technology. Currently working on ideas around branding and digital products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
