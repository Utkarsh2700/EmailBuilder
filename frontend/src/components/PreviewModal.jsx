import React from "react";

const PreviewModal = ({ html, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default PreviewModal;
