import React, { Suspense } from "react";
import smileyWoman from "../assets/smileyWoman.png";

const FeatureFive = () => {
  return (
      <div className="img-container">
        <Suspense fallback={<div>Image loading...</div>}>
        <img src={smileyWoman} alt="Web designer image" className="img-fluid" loading="lazy"/>
        </Suspense>
    </div>
  );
};

export default FeatureFive;
