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

// Define your topics map
const topicsMap = {
    "Opening Theory": 1,
    "Middle Game Strategy": 2,
    // ... other topics
};

export default function AddQuestionForm({ formType, questionId, questionData, onQuestionAdded, onQuestionUpdated }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [topic, setTopic] = useState("");
    const { closeModal } = useModal();
    const sessionUser = useSelector((state) => state.session.user);

    useEffect(() => {
        if (formType === 'Edit') {
            setTitle(questionData?.title);
            setBody(questionData?.body);
            setTopic(questionData?.topic); // Assuming questionData contains a 'topic' field
        }
    }, [formType, questionData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            title,
            body,
            user_id: sessionUser.id,
            topic_id: topicsMap[topic],
        };

        if (formType === "Edit") {
            onQuestionUpdated(formData, questionId);
        } else {
            onQuestionAdded(formData);
        }

        closeModal();
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
