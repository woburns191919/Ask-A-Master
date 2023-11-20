import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"
import "./styles.css";

const SavedQuestions = ({ userId }) => {
  console.log("user id from sq", userId);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const history= useHistory()

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      if (!userId) {
        history.push('/login')
      }
      try {
        const response = await fetch(`/api/users/${userId}/saved_questions`);
        console.log("response from sq", response);
        if (!response.ok) throw new Error("Failed to fetch saved questions");
        const data = await response.json();
        setSavedQuestions(data);
      } catch (error) {
        console.error("Error fetching saved questions:", error);
      }
    };

    fetchSavedQuestions();
  }, [userId]);


  return (
    <div className="main-layout">
      <div className="content-wrapper">
        {/* Left Sidebar Placeholder */}
        <div className="sidebar sidebar-menu">
          {/* placeholder content */}
        </div>

        {/* Main Content */}
        <div className="content">
          <div className="ask-share-container">
            {/* Main content for saved questions */}
            <h2>Saved Questions</h2>
            <div className="question-answers-container">
              {savedQuestions.map((question, index) => (
                <div className="question-answer-box" key={index}>
                  <h5>{question.title}</h5>
                  <div className="question-box comment-text">
                    <p>{question.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Placeholder */}
        <div className="related-topics">
          {/* placeholder content */}
        </div>
      </div>
    </div>
  );
};


export default SavedQuestions;
