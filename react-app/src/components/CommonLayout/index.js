import React from "react";
import "./layoutStyles.css";

//encapsulates common layout patterns,
//can wrap component in this so it can inherit structure/styling--see app.js

const CommonLayout = ({ children }) => {
  console.log('children from CommonLayout', children)
  return (
    <div className="main-layout">
      {children}
    </div>
  );
};

export default CommonLayout;
