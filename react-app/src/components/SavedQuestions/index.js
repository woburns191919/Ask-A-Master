import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"
import { useBookmarkContext } from "../../context/BookmarkContext";
import ellipsis from "../../images/ellipsis.png";
import "./styles.css";

const SavedQuestions = ({ userId }) => {
  console.log('saved q mounting')
  console.log("user id from sq", userId);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const history= useHistory()
  const { removeBookmark } = useBookmarkContext();

  const toggleDropdown = (questionId) => {
    setShowDropdown(showDropdown === questionId ? null : questionId);
  };

  const closeDropdown = () => {
    setShowDropdown(null);
  };

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      if (!userId) {
        history.push('/login')
      }
      try {
        const response = await fetch(`/api/users/${userId}/saved_questions`);
        // console.log("response from sq", response);
        if (!response.ok) throw new Error("Failed to fetch saved questions");
        const data = await response.json();
        console.log('data from saved questions', data)
        setSavedQuestions(data);
      } catch (error) {
        console.error("Error fetching saved questions:", error);
      }
    };

    fetchSavedQuestions();
  }, [userId]);

  const handleUnsavedQuestion = async (questionId) => {
    const updatedQuestions = savedQuestions.filter((q) => q.id !== questionId);
    setSavedQuestions(updatedQuestions);
    try {
      const response = await fetch(`/api/questions/${questionId}/unsave`, {
        method: "DELETE",
      });
      removeBookmark(questionId);
      if (!response.ok) {
        throw new Error("Failed to save the question");
      }
    } catch (error) {
      console.error("Error unsaving question:", error);
    }
  };




  console.log('saved questions', savedQuestions)

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
                    {console.log('image filename', question.image_filename)}
                    {question.image_filename && (
                    <img
                      className="photos"
                      src={`/${question.image_filename}`}
                      alt="Related"
                      style={{ height: "400px" }}
                    />
                  )}
                  </div>
                  <div className="ellipsis-container">
                    <img
                      className="ellipsis"
                      src={ellipsis}
                      alt="Options"
                      onClick={() => toggleDropdown(question.id)}
                    />
                    {showDropdown === question.id && (
                      <div className="dropdown">
                        <button onClick={() => {
                          handleUnsavedQuestion(question.id);
                          closeDropdown();
                        }}>
                          Remove Bookmark
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="related-topics">
          {/* Right Sidebar Placeholder */}
        </div>
      </div>
    </div>
  );
};

export default SavedQuestions;
