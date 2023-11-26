import React from "react";
import GetTopics from "../GetTopics";
import "./styles.css";

const CommonLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">
          <GetTopics />
        </div>
        <div className="content">
          {children}
        </div>
        <div className="related-topics">
          {/* Placeholder for right sidebar if needed */}
        </div>
      </div>
    </div>
  );
};

export default CommonLayout;
