import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useBookmarkContext } from "../../context/BookmarkContext";
import ellipsis from "../../images/ellipsis.png";
import "./styles.css";

const SavedQuestions = ({ userId }) => {
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const history = useHistory();
  const { removeBookmark } = useBookmarkContext();

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      if (!userId) {
        history.push("/login");
      } else {
        try {
          const response = await fetch(`/api/users/${userId}/saved_questions`);
          if (!response.ok) throw new Error("Failed to fetch saved questions");
          const data = await response.json();
          setSavedQuestions(data);
        } catch (error) {
          console.error("Error fetching saved questions:", error);
        }
      }
    };
    fetchSavedQuestions();
  }, [userId, history]);

  const toggleDropdown = (questionId) =>
    setShowDropdown(showDropdown === questionId ? null : questionId);
  const closeDropdown = () => setShowDropdown(null);

  const handleUnsavedQuestion = async (questionId) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/unsave`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to unsave the question");
      removeBookmark(questionId);
      setSavedQuestions(savedQuestions.filter((q) => q.id !== questionId));
    } catch (error) {
      console.error("Error unsaving question:", error);
    }
  };

  return (
    <div className="main-layout">
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">{/* Sidebar content */}</div>
        <div className="content">
          <div className="bookmarks">
            <h4>Bookmarks</h4>
           
            <hr></hr>
          </div>
          <div className="question-answers-container">
            {savedQuestions.map((question, index) => (
              <div className="question-answer-box" key={index}>
                <p>{question.title}</p>
                <div className="answer-box">
                  <p>{question.body}</p>
                </div>
                {question.image_filename && (
                  <img
                    className="photos"
                    src={`/${question.image_filename}`}
                    alt="Related"
                  />
                )}
                <div className="ellipsis-container">
                  <img
                    className="ellipsis"
                    src={ellipsis}
                    alt="Options"
                    onClick={() => toggleDropdown(question.id)}
                  />
                  {showDropdown === question.id && (
                    <div className="dropdown">
                      <button
                        onClick={() => {
                          handleUnsavedQuestion(question.id);
                          closeDropdown();
                        }}
                      >
                        Remove Bookmark
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="search-page">{/* Related topics section */}</div>
      </div>
    </div>
  );
};

export default SavedQuestions;
