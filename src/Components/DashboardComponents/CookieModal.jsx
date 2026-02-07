import React from "react";
import { FaCookieBite } from "react-icons/fa";



const CookieConsentModal= ({ onAccept, onReject }) => {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <p className="text-primary fw-bold fs-3"><FaCookieBite/> Cookies Consent</p>
        <p className="text-center">
          This website uses cookies to help you have a superior and more admissible browsing experience on the website. 
        </p>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={onReject} style={rejectBtn} className="w-50">
            Reject
          </button>
          <button onClick={onAccept} style={acceptBtn} className="w-50">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentModal;

/* --- Simple styles --- */
const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "end",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: "8px",
  maxWidth: "400px",
  width: "100%",
};

const acceptBtn = {
  background: "#0D6EFD",
  color: "#fff",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
};



const rejectBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "8px",
};
