import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useBookmarkContext } from "../../context/BookmarkContext";
import { useDispatch, useSelector } from "react-redux";
import ellipsis from "../../images/ellipsis.png";
import GetTopics from "../GetTopics";
import RelatedTopics from "../RelatedTopics";
import UserProfileInfo from "../UserProfileInfo";
import { thunkGetAllUsers } from "../../store/session";
import "./styles.css";

import willProfile from "../../images/wbheadshot.jpg";
import magnusProfile from "../../images/magnus-profile.png";
import garryProfile from "../../images/garry.jpg";
import anandProfile from "../../images/anand.png";
import bobbyProfile from "../../images/bobby.jpg";
import kramnikProfile from "../../images/kramnik.jpg";
import karpovProfile from "../../images/karpov.jpg";
import talProfile from "../../images/tal.jpg";
import fabProfile from "../../images/fab.jpg";
import hikaruProfile from "../../images/hikaru.jpg";
import levonProfile from "../../images/levon.jpg";

import defaultProfile from "../../images/default-profile.png";



const SavedQuestions = ({ userId }) => {
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const history = useHistory();
  const { removeBookmark } = useBookmarkContext();

  const userImages = {
    1: willProfile,
    2: magnusProfile,
    3: garryProfile,
    4: anandProfile,
    5: bobbyProfile,
    6: kramnikProfile,
    7: karpovProfile,
    8: talProfile,
    9: fabProfile,
    10: hikaruProfile,
    11: levonProfile
  };

  const dispatch = useDispatch();

  const users = Object.values(
    useSelector((state) =>
      state.session.allUsers ? state.session.allUsers : []
    )
  );

  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);

  const handleBoxClick = (questionId, event) => {
    if (event.target.closest(".ellipsis-container")) {
      return;
    }
    history.push(`/questions/${questionId}`);
  };

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
    <main className="main-container">
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">
          <GetTopics />
        </div>
        <div className="saved-question-wrapper">
          <div className="ask-share-container">
          <div className="topic-info-container">
            <h2>Saved Questions</h2>
          </div>

          </div>
        {savedQuestions.map((question, index) => (
          <div
            className="question-answer-box"
            key={index}
            onClick={(e) => handleBoxClick(question.id, e)}
          >
             <div className="user-profile-container">
                      <img
                        src={userImages[question.user_id] || defaultProfile}
                        className="user-profile-image"
                        alt="Profile"
                      />
                      <div className="user-credentials">
                        <div className="user-name">
                          {
                            users[0]?.find((user) => user.id === question.user_id)
                              ?.first_name
                          }{" "}
                          {
                            users[0]?.find((user) => user.id === question.user_id)
                              ?.last_name
                          }
                        </div>
                        <div className="elo-rating">
                          ELO Rating{" "}
                          <span>
                            {
                              users[0]?.find(
                                (user) => user.id === question.user_id
                              )?.elo_rating
                            }
                          </span>
                        </div>
                      </div>
                    </div>
            <h4>{question.title}</h4>
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

        <div className="related-topics-main-container">
          <RelatedTopics showAds={true} />
        </div>
      </div>
    </main>
  );
};
export default SavedQuestions;
