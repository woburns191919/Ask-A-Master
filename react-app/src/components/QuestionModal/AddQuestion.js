import React, { useState, useEffect } from "react";
import { useModal } from "../../context/Modal";

const modalStyles = {
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
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  maxWidth: "500px",
  width: "100%",
};

const labelStyles = {
  fontWeight: "bold",
  margin: "8px 0",
};

const inputStyles = {
  width: "100%",
  padding: "10px",
  border: "2px solid #ccc",
  borderRadius: "4px",
  marginBottom: "20px",
};

const buttonStyles = {
  backgroundColor: "#0073e6",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "10px 20px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const modalButtonStyles = {
  ...buttonStyles,
  backgroundColor: "#0050a3", // Darker blue on hover
};

export default function AddQuestionForm() {
  const [question, setQuestion] = useState("");
  const { closeModal } = useModal();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = async () => {
    // if (selectedFeature === 'addQuestion') {
    const formData = {
        title,
        body
    }
    try {
      const res = await fetch("/api/questions/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('data', data)
        closeModal();
      } else {
        console.error("Failed to add a question. Status:", res.status);
      }
    } catch (error) {
      console.error("Failed to add a question:", error);
    }
    // }
  };
  useEffect(() => {
    window.addEventListener("mousedown", handleCloseModal);
    return () => {
      window.removeEventListener("mousedown", handleCloseModal);
    };
  }, []);

  return (
    <div style={modalStyles}>
      <div style={modalContentStyles}>
        <label style={labelStyles}>Title</label>
        <input
          type="text"
          placeholder="Enter your question title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyles}
        />
        <label style={labelStyles}>Question</label>
        <textarea
          placeholder="Start your question with 'What', 'How', 'Why', etc."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={inputStyles}
        />
        <button onClick={handleSubmit} style={buttonStyles}>
          Submit Question
        </button>
        <button onClick={closeModal} style={modalButtonStyles}>
          Cancel
        </button>
      </div>
    </div>
  );
}
