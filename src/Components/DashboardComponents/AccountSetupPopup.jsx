import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUniversity, FaCheck } from "react-icons/fa";
import "./AccountSetupPopup.css";

const AccountSetupPopup = ({ show = true, onClose  }) => {
  if (!show) return null;
const handleOverlayClick = () => {
    onClose();
  };
  return (
    <div className="popup-overlay" onClick={handleOverlayClick}>
      <div className="popup-wrapper">

          {/* White content */}
          <div className="popup-content">

            <div className="d-flex justify-content-between align-items-center">

              <div>
                <h2 className="popup-title">
                  Complete Your<br />
                  Account Setup
                </h2>
                </div>

              <div className="icon-wrapper">
                <FaUniversity />
                <span>
                  <FaCheck />
                </span>
              </div>
              </div>
               <p className="popup-text">
                  To ensure easy remittance of payments made via your
                  chosen channels, please set up your bank account.
                </p>





            {/* breadcrumb */}
            <div className="setup-path">
              <span>System Settings</span>
              <b>›</b>
              <span>Configurations</span>
              <b>›</b>
              <span>Manage Bank Account</span>
            </div>


            <div className="actions mt-4">

              <button className="btn setup-btn">
                Set up Account
              </button>

              <button className="btn later-btn">
                Later
              </button>

            </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSetupPopup;