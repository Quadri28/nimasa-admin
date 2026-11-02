
import { useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import Modal from "react-modal";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { UserContext } from "./AuthContext";
import { IoMdHourglass } from "react-icons/io";
import { LiaTimesCircle } from "react-icons/lia";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const IDLE_TIMEOUT = 120000; // 2 minutes
const LOGOUT_COUNTDOWN = 60; // 60 seconds

const IdleTimer = () => {
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(LOGOUT_COUNTDOWN);

  const navigate = useNavigate();
  const { credentials } = useContext(UserContext);

  const countdownIntervalRef = useRef(null);

 const customStyle = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },

  content: {
    position: "relative",
    inset: "auto",
    width: "360px",
    maxWidth: "90%",
    padding: "20px 25px 25px",
    border: "none",
    borderRadius: "18px",
    background: "#fff",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.18)",
    overflow: "visible",
  },
};

  const clearCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    clearCountdown();
    setOpen(false);
    setRemaining(LOGOUT_COUNTDOWN);
  }, [clearCountdown]);

  const handleLogout = useCallback(() => {
    clearCountdown();

    sessionStorage.removeItem("cooperative-details");

    window.location.replace("/cooperative-signin");
  }, [clearCountdown]);

  const handleOnIdle = useCallback(() => {
    if (!credentials?.token) return;

    // Start a fresh 60-second countdown
    setRemaining(LOGOUT_COUNTDOWN);
    setOpen(true);
  }, [credentials]);

  const handleKeepSignedIn = useCallback(() => {
    clearCountdown();
    setRemaining(LOGOUT_COUNTDOWN);
    setOpen(false);

    // Reset the 5-minute idle timer
    reset();
  }, [clearCountdown]);

  const handleOnAction = useCallback(() => {
    // Don't close the modal automatically here.
    // The user should explicitly choose "Keep me signed in".
  }, []);

  const { reset } = useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle: handleOnIdle,
    onAction: handleOnAction,
    debounce: 500,
    disabled: !credentials?.token,
  });

  // 60-second modal countdown
  useEffect(() => {
    if (!open) {
      clearCountdown();
      return;
    }

    countdownIntervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearCountdown();
          handleLogout();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearCountdown();
  }, [open, clearCountdown, handleLogout]);

  // Calculate circular progress
  const progress = (remaining / LOGOUT_COUNTDOWN) * 100;

  // Format as MM:SS
  const formattedTime = `00:${String(remaining).padStart(2, "0")}`;

  return (
    <>
      {credentials?.token && (
        <Modal
          isOpen={open}
          onRequestClose={() => {}}
          ariaHideApp={false}
          style={customStyle}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
        >
          {/* Close */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <LiaTimesCircle
              size={24}
              onClick={handleClose}
              style={{
                cursor: "pointer",
                color: "#555",
              }}
            />
          </div>

          {/* Hourglass */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5px",
            }}
          >
            <IoMdHourglass
              size={38}
              style={{
                color: "#999",
              }}
            />
          </div>

          {/* Heading */}
          <h2
            style={{
              textAlign: "center",
              fontSize: "21px",
              fontWeight: 600,
              marginTop: "8px",
              marginBottom: "20px",
              color: "#1d1d1d",
            }}
          >
            You've Been Idle
          </h2>

          {/* Circular Countdown */}
          <div
            style={{
              width: "190px",
              height: "190px",
              margin: "0 auto",
            }}
          >
            <CircularProgressbar
              value={progress}
              text={formattedTime}
              strokeWidth={5}
              styles={buildStyles({
                pathColor: "var(--custom-color)",
                trailColor: "#E5F2FA",
                textColor: "#111",
                textSize: "20px",
                pathTransitionDuration: 0.5,
              })}
            />

            {/* Seconds text */}
            <div
              style={{
                textAlign: "center",
                marginTop: "-55px",
                fontSize: "12px",
                color: "#777",
                position: "relative",
              }}
            >
              seconds until logout
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "45px",
            }}
          >
            <button
              type="button"
              onClick={handleLogout}
              style={{
                border: "none",
                borderRadius: "7px",
                padding: "10px 15px",
                color: "#333",
                backgroundColor: "#e9ecef",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Log Out Now
            </button>

            <button
              type="button"
              onClick={handleKeepSignedIn}
              style={{
                border: "none",
                borderRadius: "7px",
                padding: "10px 15px",
                color: "#fff",
                backgroundColor: "var(--custom-color)",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Keep Me Signed In
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default IdleTimer;