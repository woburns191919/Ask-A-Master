import React, { useState } from "react";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";

export default function CreateTopicForm({ addNewTopic }) {
  const [topicName, setTopicName] = useState("");
  const [description, setDescription] = useState("");
  const { closeModal } = useModal();
  const [topics, setTopics] = useState([]);

  const modalStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
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

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/topics/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: topicName,
        description,
      }),
    });
    if (response.ok) {
      const newTopic = await response.json();

      addNewTopic(newTopic);

      closeModal();
      history.push(`/topics/${newTopic.id}`);
    } else {
      console.error("Failed to create topic");
    }
  };

  return (
    <div style={modalStyles} onClick={() => closeModal()}>
      <div style={modalContentStyles} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <label style={labelStyles}>Topic Name</label>
          <input
            type="text"
            placeholder="Topic Name"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            style={inputStyles}
          />

          <button type="submit" style={buttonStyles}>
            Create Topic
          </button>
        </form>
      </div>
    </div>
  );
}
