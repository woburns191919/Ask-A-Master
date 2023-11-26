import React from "react";
import GetTopics from "../GetTopics";
import "./layoutStyles.css";

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
      </div>
    </div>
  );
};

export default CommonLayout;
