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
      className={`fixed inset-0 ${
        isOpen ? 'flex' : 'hidden'
      } items-center justify-center z-50`}
    >
      <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
      <div className="bg-white p-6 rounded shadow-md w-64 z-0">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-4">Are you sure you want to delete this item?</p>
        <div className="flex justify-end">
          <button
            className={`px-4 py-2 mr-2 ${
              isConfirming ? 'bg-red-600' : 'bg-gray-400'
            } text-white rounded`}
            onClick={
              isConfirming ? handleDelete : setIsConfirming.bind(null, true)
            }
          >
            {isConfirming ? 'Confirm' : 'Delete'}
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
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
