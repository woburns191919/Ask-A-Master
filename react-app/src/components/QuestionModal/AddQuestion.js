import React, { useState } from "react";
import { useModal } from "../../context/Modal";
// import "./styles.css"

export default function AddQuestionForm() {
  const [question, setQuestion] = useState("");
  const { closeModal } = useModal();
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")

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

  return (
    <div>
      <textarea
        placeholder="Start your question with 'What', 'How', 'Why', etc."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Question</button>
    </div>
  );
}
