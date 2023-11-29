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
    padding: "10px",
    margin: "20px 0", // Add margin to separate it from navigation
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Add shadow for depth
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column", // Stack inputs vertically
    gap: "10px", // Space between elements
    width: "85%"
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
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
      setTitle("");
      setBody("");
      setTopic("");
      handleAddQuestion(newQuestion.question);
      setImageFilename(newQuestion.image_filename);
      console.log("new question data", newQuestion);
    } else {
      console.error("Failed to post question");
    }
  };

  return (
    <div style={askShareInputStyle}>
      {/* <input
        type="text"
        placeholder="Title of your question"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={inputStyle}
      /> */}
      <textarea
        placeholder="What do you want to ask or share?"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={textareaStyle}
      />
      <button onClick={handleSubmit} style={buttonStyle}>
        Post
      </button>
      {/* {imageFilename && (
        <div>
          <img src={`/${imageFilename}`} alt="Question related" />
        </div>
      )} */}
    </div>
  );
}
