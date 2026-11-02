import React, { useState } from "react";
import Modal from "react-modal";
import { FaSearchPlus } from "react-icons/fa";
import './ImagePreview.css'

const ImagePreview = ({
  src,
  alt = "Preview Image",
  width = "120px",
  height = "120px",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`image-box ${className}`} onClick={() => setIsOpen(true)}>
        <img
          src={src}
          alt={alt}
          className="view-img"
          style={{ width, height }}
        />
        <div className="zoom-icon">
          <FaSearchPlus />
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        ariaHideApp={false}
        className="image-preview-modal"
        overlayClassName="image-preview-overlay"
      >
        <img src={src} alt={alt} className="preview-image" />
      </Modal>
    </>
  );
};

export default ImagePreview;