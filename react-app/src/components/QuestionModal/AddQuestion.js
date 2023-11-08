import React, { useState, useEffect, useRef } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllUsers } from "../../store/session";


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
  const [validationObj, setValidationObj] = useState({});
  const [userProvidedTopic, setUserProvidedTopic] = useState(""); // User-provided topic
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const fetchHandleQuestion = async (formData) => {
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
        closeModal();
        return data
      } else {
        console.error("Failed to add a question. Status:", res.status);
      }
    } catch (error) {
      console.error("Failed to add a question:", error);
    }
  };

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Map of topics where the keys are the topic names
  const topicsMap = {
    "Opening Theory": 1,
    "Middle Game Strategy": 2,
    "Endgame Techniques": 3,
    "Tactics and Combinations": 4,
    "Chess Analysis": 5,
    "Avoiding Blunders": 6,
    "Chess Books and Resources": 7,
  };

  // Function to get the topic ID based on the topic name
  const getTopicId = (topicName) => {
    return topicsMap[topicName] || null; // Return the topic ID or null if not found
  };

  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    // Convert the user-provided topic to a topic ID
    e.preventDefault();
    const topicId = getTopicId(userProvidedTopic);

    const formData = {
      title,
      body: question,
      user_id: sessionUser.id,
      topic_id: topicId, // Use the converted topic ID
    };
    try {
      fetchHandleQuestion(formData);
      console.log('form data***', formData)
    } catch (error) {
      console.error("Error processing question:", error.message);
    }
  };

  const clearValidationError = (validationField) => {
    setValidationObj((prev) => {
      const newObj = { ...prev };
      delete newObj[validationField];
      return newObj;
    });
  };

  const handleInputChange = (setterFunction, validationField) => (e) => {
    const value = e.target.value;
    console.log(`Setting ${validationField} to:`, value);
    setterFunction(value);
    clearValidationError(validationField);
  };



  return (
    <div style={modalStyles} onClick={handleCloseModal}>
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
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
        {/* Add an input for the user to provide the topic */}
        <label style={labelStyles}>Topic</label>
        <input
          type="text"
          placeholder="Enter the topic"
          value={userProvidedTopic}
          onChange={(e) => setUserProvidedTopic(e.target.value)}
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
