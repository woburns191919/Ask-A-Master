import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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


const topicsMap = {
  "Opening Theory": 1,
  "Middle Game Strategy": 2,
  "Endgame Techniques": 3,
  "Tactics and Combinations": 4,
  "Chess Analysis": 5,
  "Avoiding Blunders": 6,
  "Chess Books and Resources": 7,
};

export default function AddQuestionForm({
  formType,
  questionId,
  onQuestionAdded,
  onUpdateQuestion,
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("");
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const response = await fetch(`/api/questions/${questionId}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setBody(data.body);
          setTopic(data.topic);
        } else {
          console.error("Failed to fetch question data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };

    if (formType === "Edit" && questionId) {
      fetchQuestionData();
    }
  }, [formType, questionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      body,
      user_id: sessionUser.id,
      topic_id: topicsMap[topic] || 1,
    };

    try {
      let url;
      let method;

      if (formType === "Edit") {
        // Update URL and method for editing
        url = `/api/questions/edit/${questionId}`;
        method = "PUT";
      } else {
        // URL and method for creating a new question
        url = "/api/questions/new";
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('data from AddQuestion', data)
        if (formType === "Edit") {
          onUpdateQuestion(data.question); // Update the question
          // console.log('data.question from add question form', data.question)
        } else {
          onQuestionAdded(data.question); // Add the new question
        }
        closeModal();
      } else {
        // Handle errors
        console.error("Failed to post question:", response.status);
      }
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  return (
    <div style={modalStyles} onClick={() => closeModal()}>
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
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={inputStyles}
        />
        <label style={labelStyles}>Topic</label>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={inputStyles}
        >
          {/* Render options for topics */}
          {Object.keys(topicsMap).map((topicName) => (
            <option key={topicName} value={topicName}>
              {topicName}
            </option>
          ))}
        </select>
        <button onClick={handleSubmit} style={buttonStyles}>
          {formType === "Edit" ? "Update Question" : "Submit Question"}
        </button>
      </div>
    </div>
  );
}
