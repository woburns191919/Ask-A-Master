import React from "react";
import MainLayout from "../MainLayout";
import "./layoutStyles.css";

const CommonLayout = ({ children }) => {
  return (
    <div className="main-layout">
      {children}
      {/* <MainLayout/> */}
    </div>
  );
};

export default CommonLayout;
