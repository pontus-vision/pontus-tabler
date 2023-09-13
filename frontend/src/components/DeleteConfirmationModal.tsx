import React, { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete }: Props) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <div
      className={`delete-confirmation ${
        isOpen ? 'flex' : 'hidden'
      } items-center justify-center z-50`}
    >
      <div className="delete-confirmation-overlay"></div>
      <div className="delete-confirmation-content">
        <h2 className="delete-confirmation-title">Confirm Deletion</h2>
        <p className="delete-confirmation-text">
          Are you sure you want to delete this item?
        </p>
        <div className="delete-confirmation-buttons">
          <button
            className={`delete-confirmation-button ${
              isConfirming ? 'confirm-button' : 'delete-button'
            }`}
            onClick={isConfirming ? handleDelete : () => setIsConfirming(true)}
          >
            {isConfirming ? 'Confirm' : 'Delete'}
          </button>
          <button
            className="delete-confirmation-button cancel-button"
            onClick={() => {
              setIsConfirming(false);
              onClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
