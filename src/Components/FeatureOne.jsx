import React, { Suspense } from "react";
import "./Features.css";
import woman from "../assets/woman.png";

const FeatureOne = () => {
  return (
      <div className="img-container">
        <Suspense fallback={<div>Image loading...</div>}>
        <img src={woman} alt="Web designer image" className="img-fluid" loading="lazy"/>
        </Suspense>
      </div>
  );
};

export default FeatureOne;
