import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useBookmarkContext } from "../../context/BookmarkContext";
import ellipsis from "../../images/ellipsis.png";
import GetTopics from "../GetTopics";
import "./styles.css";

const SavedQuestions = ({ userId }) => {
  console.log("saved q mounting");
  console.log("user id from sq", userId);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const history = useHistory();
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
        history.push("/login");
      }
      try {
        const response = await fetch(`/api/users/${userId}/saved_questions`);
        // console.log("response from sq", response);
        if (!response.ok) throw new Error("Failed to fetch saved questions");
        const data = await response.json();
        console.log("data from saved questions", data);
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

  console.log("saved questions", savedQuestions);

  return (
    <div className="main-layout">
      {" "}
      <div className="content-wrapper">
        {" "}
        {/* Same as MainLayout */}
        <div className="sidebar sidebar-menu"></div>
        <div className="content">
          {" "}
          {/* Same as MainLayout */}
         
            {/* Main content for saved questions */}
            <h2>Bookmarks</h2>
            <div className="main-container">
              {savedQuestions.map((question, index) => (
                <div className="question-answer-box" key={index}>
                  <h5>{question.title}</h5> {/* Title in bold */}
                  <div className="answer-box">
                    <p>{question.body}</p> {/* Answer text */}
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
      </div>
    </div>
  );
};

export default SavedQuestions;

//question-answer-box
//     margin-right: 50%;
//  margin-left: -73%;
//  width: 150%;
