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

export default function AddQuestionForm({ formType = "Create", questionId, onQuestionAdded, onQuestionUpdated }) {
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
  const [allQuestions, setAllQuestions] = useState([]);

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
      const url = formType === "Edit" ? `/api/questions/edit/${questionId}` : "/api/questions/new";
      const method = formType === "Edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && formType === "Edit") {
        // console.log("API response data:", data); // response data
        onQuestionUpdated(data.question);
        closeModal();
        return formType === "Create" ? data.question : data; // 'data.question' is the new question for Create
      } else {
        console.error("Failed to handle question. Status:", res.status, data);
      }
    } catch (error) {
      console.error("Error in fetchHandleQuestion:", error);
    }
  };


  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Function to get the topic ID based on the topic name
  const getTopicId = (topicName) => {
    return topicsMap[topicName] || null; // Return the topic ID or null if not found
  };

  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);

  const fetchQuestion = async () => {
    try {
      const res = await fetch(`/api/questions/${questionId}`);
      console.log("res", res);
      if (res.ok) {
        const data = await res.json();
        // console.log("data from fetch question", data);
        return data;
      } else {
        console.error(
          "Failed to fetch question data:",
          res.status,
          res.statusText
        );
        return null;
      }
    } catch (error) {
      console.error("Error in fetchQuestion:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (formType === 'Edit' && questionId) {
        try {
          const res = await fetchQuestion(questionId);
          if (res) {
            setTitle(res.title);
            setQuestion(res.body);
            setUserProvidedTopic(res.userProvidedTopic);
          } else {
            console.error(`Failed to fetch question data for question id: ${questionId}`);
          }
        } catch (error) {
          console.error("Error in fetchQuestion:", error);
        }
      }
    };

    fetchData();
  }, [questionId, formType]);


  const handleSubmit = async (e) => {
    // console.log('handle submit from add question')
    // Convert the user-provided topic to a topic ID
    e.preventDefault();
    const topicId = getTopicId(userProvidedTopic);

    const formData = {
      title,
      body: question,
      user_id: sessionUser.id,
      topic_id: topicId, // Use the converted topic ID
    };
    // console.log('form data from handle submit', formData)
    try {
      const newQuestion = await fetchHandleQuestion(formData);
      // console.log('new question***', newQuestion)
      if (newQuestion && formType === "Create") {
        onQuestionAdded(newQuestion); // Use the callback
      }
    } catch (error) {
      console.error("Error processing question:", error.message);
    }
  };


// console.log("onQuestionAdded prop:", onQuestionAdded);


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
          {formType === "Edit" ? "Update Question" : "Submit Question"}
        </button>
        <button style={modalButtonStyles} onClick={handleCloseModal}>
          Cancel
        </button>
        {/* {console.log('form type', formType)} */}
      </div>
    </div>
  );
}
