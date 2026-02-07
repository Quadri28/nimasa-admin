import React from "react";
import { BsPatchCheckFill } from "react-icons/bs";

const Requirement = () => {
  return (
    <div className="mx-auto bg-white p-3 responsibility">
      <h6 className="text-center">UCP agent Requirements</h6>
      <div className="row gap-2 justify-content-between px-3 my-3 inner-responsibility">
        <div className="col-sm-6 row g-1  gap-1">
          <span className="col-1">
            <BsPatchCheckFill style={{ color: "#022B69" }} />
          </span>
          <span className="col-10">
            Provide workable plan to achieve Cooperative onboarding on the
            application
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
          <span className="col-1">
            <BsPatchCheckFill style={{ color: "#022B69" }} />
          </span>
          <span className="col-10">
            Provide technical support to Cooperative Societies during the first
            month of subscription
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
          <span className="col-1">
            <BsPatchCheckFill style={{ color: "#022B69" }} />
          </span>
          <span className="col-10">
            Assist Cooperative Societies with data migration
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
          <span className="col-1">
            <BsPatchCheckFill style={{ color: "#022B69" }} />
          </span>
          <span className="col-10">
            Register Cooperative Societies on the application
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
          <span className="col-1">
            <BsPatchCheckFill style={{ color: "#022B69" }} />
          </span>
          <span className="col-10">
            Train Cooperative Societies on the use of the application
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
          <span className="col-1">
            <BsPatchCheckFill style={{ color: "#022B69" }} />
          </span>
          <span className="col-10">
            Ensure Cooperative Societies use the application for their
            operations
          </span>
        </div>
        <div className="col-sm-6 row g-1  gap-1">
          <span className="col-1">
            <BsPatchCheckFill style={{ color: "#022B69" }} />
          </span>
          <span className="col-10">
            Send weekly reports on activities to the state coordinator
          </span>
        </div>
      </div>
    </div>
  );
};

export default Requirement;
