import React from "react";
import { BsPatchCheckFill } from "react-icons/bs";

const Responsibility = () => {
  return (
    <div className="mx-auto bg-white p-3 responsibility">
      <h6 className="text-center"> UCP agent Requirements</h6>
      <div className="row gap-2 justify-content-between px-3 my-3 inner-responsibility">
        <div className="col-sm-6 row g-1  gap-1">
            <span className="col-1">
          <BsPatchCheckFill style={{ color: "#022B69" }} />
          </span>
          <span className="col-10">
            No prior experience necessary but must really love to do sales
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
            <span className="col-1" >
          <BsPatchCheckFill style={{ color: "#022B69" }}/>
          </span>
          <span className="col-10">
            Proficient in Microsoft Excel and other Microsoft office package
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
            <span className="col-1">
          <BsPatchCheckFill style={{ color: "#022B69" }}  />
          </span>
          <span className="col-10">
            Minimum of OND in any relevant discipline
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
            <span className="col-1">
          <BsPatchCheckFill style={{ color: "#022B69" }}  />
          </span>
          <span className="col-10">
            Be able to speak and communicate in English and also the state
            dialect
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
            <span  className="col-1">
          <BsPatchCheckFill style={{ color: "#022B69" }} />
          </span>
          <span className="col-10">
            Client Relationships and ability to multitask
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
            <span  className="col-1">
          <BsPatchCheckFill style={{ color: "#022B69" }}  />
          </span>
          <span className="col-10">
            Candidate should have a laptop and have data entry accuracy
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
            <span className="col-1">
          <BsPatchCheckFill style={{ color: "#022B69" }} />
          </span>
          <span className="col-10">Persuasion and communication skills</span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
            <span className="col-1">
          <BsPatchCheckFill style={{ color: "#022B69" }}  />
          </span>
          <span className="col-10">Able to meet deadlines</span>
        </div>
      </div>
    </div>
  );
};

export default Responsibility;
