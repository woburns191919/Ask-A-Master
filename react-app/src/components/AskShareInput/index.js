import React, { useState } from "react";
import { useSelector } from "react-redux";

const topicsMap = {
  "Opening Theory": 1,
  "Middle Game Strategy": 2,
  "Endgame Techniques": 3,
  "Tactics and Combinations": 4,
  "Chess Analysis": 5,
  "Avoiding Blunders": 6,
  "Chess Books and Resources": 7,
};

export default function AskShareComponent({ handleAddQuestion }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topic, setTopic] = useState("");
  const [imageFilename, setImageFilename] = useState("");

  const askShareInputStyle = {
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    gap: "10px",
  };

  const textareaStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "80px",
  };

  const buttonStyle = {
    backgroundColor: "#0073e6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "10px 20px",
    cursor: "pointer",
  };

  const handleSubmit = async () => {
    const formData = {
      title,
      body,
      user_id: sessionUser.id,
      topic_id: topicsMap[topic] || 1, 
    };

    const response = await fetch("/api/questions/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const newQuestion = await response.json();
      //console.log('new question (JSON)', newQuestion)
      setTitle("");
      setBody("");
      setTopic("");
      //clearing form for future submissions, also indicates successful processing
      handleAddQuestion(newQuestion.question);
      setImageFilename(newQuestion.image_filename);
    } else {
      console.error("Failed to post question"); //response from server if not ok
    }
  };

  return (
    <div style={askShareInputStyle}>
      <textarea
        placeholder="What do you want to ask or share?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={textareaStyle}
      />
      <button onClick={handleSubmit} style={buttonStyle}>
        Post
      </button>
    </div>
  );
}
