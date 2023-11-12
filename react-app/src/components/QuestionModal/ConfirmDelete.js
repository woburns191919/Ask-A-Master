import React from "react";
import { useModal } from "../../context/Modal";

// Styles for modal elements
const modalContainerStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyles = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  maxWidth: "400px",
};

const confirmDeleteTextStyles = {
  fontSize: "16px",
  marginBottom: "20px",
};

const buttonContainerStyles = {
  display: "flex",
  justifyContent: "center",
};

const deleteButtonStyles = {
  backgroundColor: "#d93025",
  color: "#fff",
  padding: "10px 20px",
  margin: "0 10px",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const cancelButtonStyles = {
  backgroundColor: "#f0f0f0",
  color: "#333",
  padding: "10px 20px",
  margin: "0 10px",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const ConfirmDelete = ({ itemType, itemId, questionId, onDeletionSuccess }) => {
  const { closeModal } = useModal();

  const handleDelete = async () => {
    let url = '';

    if (itemType === 'question') {
      url = `/api/questions/${itemId}`;
    } else if (itemType === 'comment') {
      url = `/api/questions/${questionId}/comments/${itemId}`;
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDeletionSuccess(itemId);
        closeModal();
      } else {
        console.error(`Failed to delete ${itemType}:`, response.status);
      }
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    }
  };

  return (
    <div style={modalContainerStyles} onClick={closeModal}>
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        <p style={confirmDeleteTextStyles}>
          Are you sure you want to delete this {itemType}?
        </p>
        <div style={buttonContainerStyles}>
          <button style={deleteButtonStyles} onClick={handleDelete}>
            Yes, delete
          </button>
          <button style={cancelButtonStyles} onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
