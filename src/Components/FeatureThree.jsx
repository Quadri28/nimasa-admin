import React, { Suspense } from "react";
import workerholic from "../assets/workerholic.png";
const FeatureThree = () => {
  return (
      <div className="img-container">
         <Suspense fallback={<div>Image loading...</div>}>
        <img src={workerholic} alt="Web designer image" className="img-fluid" loading="lazy"/>
        </Suspense>
    </div>
  );
};

export default FeatureThree;
