import React from 'react';
import { IoClose } from "react-icons/io5";

const ConfirmationModal = ({ isOpen, onClose, url }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
        <div className="modal-content text-black">
            <button className="close-button" onClick={onClose}>
                <IoClose />
            </button>
            <h2>Transaction Approved</h2>
            <p>You may view your transaction at the link below:</p>
            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        </div>
    </div>
  );
};

export default ConfirmationModal;