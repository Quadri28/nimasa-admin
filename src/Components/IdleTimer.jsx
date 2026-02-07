import { useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import Modal from "react-modal";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { UserContext } from "./AuthContext";
import { IoMdClock } from "react-icons/io";
import { LiaTimesCircle } from "react-icons/lia";

const IdleTimer = () => {
  const [open, setOpen] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const navigate = useNavigate();
  const { credentials } = useContext(UserContext);
  const sessionTimeOutRef = useRef(null);

  const customStyle = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      boxShadow: 24,
      padding: ".8rem 1rem",
      width: "320px",
    },
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    clearTimeout(sessionTimeOutRef.current);
  };

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("cooperative-details");
     window.location.replace("/"); 
    handleClose();
  }, [navigate]);

  const handleOnIdle = useCallback(() => {
    if (!credentials?.token) return;
    handleOpen();
    sessionTimeOutRef.current = setTimeout(() => {
      handleLogout();
    }, 30000);
  }, [credentials, handleLogout]);

  const handleOnAction = useCallback(() => {
    clearTimeout(sessionTimeOutRef.current);
  }, []);

  // ✅ Always call the hook, but disable it if there's no token:
  const { getRemainingTime } = useIdleTimer({
    timeout: 300000,
    onIdle: handleOnIdle,
    onAction: handleOnAction,
    debounce: 500,
    disabled: !credentials?.token,
  });

  useEffect(() => {
    if (credentials?.token) {
      const interval = setInterval(() => {
        setRemaining(Math.ceil(getRemainingTime() / 1000));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [credentials, getRemainingTime]);

  return (
    <>
      {credentials?.token && (
        <Modal
          isOpen={open}
          onRequestClose={handleClose}
          ariaHideApp={false}
          style={customStyle}
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
        >
          <div className="d-flex justify-content-end">
            <LiaTimesCircle onClick={handleClose} style={{ cursor: "pointer" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IoMdClock size={30} style={{ marginTop: "1rem" }} />
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: "20px",
              marginTop: "10px",
            }}
          >
            You have been idle for a while
          </p>
          <p style={{ textAlign: "center" }}>
            You will be logged out in... {remaining} seconds!
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "2.5rem",
            }}
          >
            <button
              style={{
                border: "none",
                borderRadius: "5px",
                padding: "10px 13px",
                color: "#fff",
                backgroundColor: "#3a358c",
                cursor: "pointer",
                fontSize: "15px",
              }}
              onClick={handleLogout}
            >
              Log me out
            </button>
            <button
              style={{
                border: "none",
                borderRadius: "5px",
                padding: "10px 13px",
                color: "#fff",
                fontSize: "15px",
                cursor: "pointer",
                backgroundColor: "var(--custom-color)",
              }}
              onClick={handleClose}
            >
              Keep me signed in
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default IdleTimer;
