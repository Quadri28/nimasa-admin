import React, { Suspense } from "react";
import team from "../assets/team.png";

const FeatureTwo = () => {
  return (
      <div className="img-container">
         <Suspense fallback={<div>Image loading...</div>}>
        <img src={team} alt="Web designer image" className="img-fluid" loading="lazy" />
        </Suspense>
    </div>
  );
};

export default FeatureTwo;
