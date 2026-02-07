import React, { Suspense } from "react";
import caffe from "../assets/caffe.png";
const FeatureFour = () => {
  return (
      <div className="img-container">
        <Suspense fallback={<div>Image loading...</div>}>
        <img src={caffe} alt="Web designer image" className="img-fluid" loading="lazy"/>
        </Suspense>
    </div>
  );
};

export default FeatureFour;
