import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";

const modalStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  // backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  const [topic, setTopic] = useState("Opening Theory");
  const [image, setImage] = useState(null);
  const { closeModal } = useModal();
  const sessionUser = useSelector((state) => state.session.user);


  //fetch logic for editing a question, allows edit form to pre-populate
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
//only run fetch logic if editing a question

    if (formType === "Edit" && questionId) {
      fetchQuestionData();
    }
    // watching formType and question Id here--important bc
    //if you switch to a different question or change modes,
    //the form updates with the correct data
  }, [formType, questionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      body,
      user_id: sessionUser.id,
      topic_id: topicsMap[topic] || 1, // Use 1 (opening theory) as fallback if the topic is falsy
    };
    // In the future, I can allow user to upload images

    
    // Conditionally add the image property if an image exists
    // if (image) {
    //   formData.image = image;
    // }

    try {
      // Determine URL and method based on formType
      const url =
        formType === "Edit"
          ? `/api/questions/edit/${questionId}`
          : "/api/questions/new";
      const method = formType === "Edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        formType === "Edit"
          ? onUpdateQuestion(data.question)
          : onQuestionAdded(data.question);
        closeModal();
      } else {
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

        <button onClick={handleSubmit} style={buttonStyles}>
          {formType === "Edit" ? "Update Question" : "Submit Question"}
        </button>
      </div>
    </div>
  );
}
