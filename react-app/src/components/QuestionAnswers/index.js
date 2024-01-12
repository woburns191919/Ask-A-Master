import { useEffect, useState } from "react";
import { thunkGetAllUsers } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import "./questionAnswerStyles.css";

import ellipsis from "../../images/ellipsis.png";





import defaultProfile from "../../images/default-profile.png";
import OpenModalButton from "../OpenModalButton";
import AddQuestionForm from "../QuestionModal/AddQuestion";
import { useHistory } from "react-router-dom";
import { useBookmarkContext } from "../../context/BookmarkContext";
import UserProfileInfo from "../UserProfileInfo";


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

export default function QuestionAnswers({
  allQuestions,
  answersForQuestions,
  onUpdateQuestion,
  openDeleteModal,
  handleQuestionsUpdate,
}) {
  const [showDropdown, setShowDropdown] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const [images, setImages] = useState([]);

  const { addBookmark, isBookmarked, removeBookmark } = useBookmarkContext();

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

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/questions/images");
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        console.error("Failed to fetch images.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const users = Object.values(
    useSelector((state) =>
      state.session.allUsers ? state.session.allUsers : []
    )
  );

  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(thunkGetAllUsers());
  }, [dispatch]);

  const toggleDropdown = (questionId) => {
    setShowDropdown(showDropdown === questionId ? null : questionId);
  };

  const closeDropdown = () => {
    setShowDropdown(null);
  };

  const isCurrentUserAuthor = (question) => {
    return question.user_id === sessionUser?.id;
  };

  const handleBoxClick = (questionId, event) => {
    if (event.target.closest(".ellipsis-container")) {
      return;
    }
    history.push(`/questions/${questionId}`);
  };

  const handleSaveQuestion = async (questionId) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/save`, {
        method: "POST",
      });
      addBookmark(questionId);
      isBookmarked(questionId);
      history.push("/saved-questions");
      if (!response.ok) throw new Error("Failed to save the question");
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleUnsavedQuestion = async (questionId) => {
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

  return (
    <>
      {allQuestions
        ?.concat()
        .reverse()
        .map((question, index) => {
          const userId = question.user_id.toString();
          const userProfileImage = userImages[userId] || defaultProfile;
          const user = users[0]?.find(
            (user) => user.id === parseInt(question.user_id)
          );
          return (
            <div
              className="question-answer-box"
              key={index}
              onClick={(e) => handleBoxClick(question.id, e)}
            >
              <UserProfileInfo
                user={user}
                userProfileImage={userProfileImage}
              />
              <br></br>
              <div>
                <h5 className="title-content">{question.title}</h5>
                <p className="question-content">{question.body}</p>
              </div>
              <div className="answer-box">
                {answersForQuestions &&
                  answersForQuestions[question.id]?.map((answer, i) => (
                    <p key={i}>{answer.content}</p>
                  ))}
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
                  onClick={() => toggleDropdown(question.id)}
                />
                {showDropdown === question.id && (
                  <div className="dropdown">
                    {isCurrentUserAuthor(question) && (
                      <>
                        <OpenModalButton
                          buttonText="Edit question"
                          modalComponent={
                            <AddQuestionForm
                              formType="Edit"
                              questionId={question.id}
                              onUpdateQuestion={onUpdateQuestion}
                              closeModal={closeDropdown}
                              handleQuestionsUpdate={handleQuestionsUpdate}
                            />
                          }
                        />
                        <button onClick={() => openDeleteModal(question.id)}>
                          Delete question
                        </button>
                      </>
                    )}
                    {!isBookmarked(question.id) && (
                      <button onClick={() => handleSaveQuestion(question.id)}>
                        Bookmark
                      </button>
                    )}
                    {isBookmarked(question.id) && (
                      <button
                        onClick={() => handleUnsavedQuestion(question.id)}
                      >
                        Remove Bookmark
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </>
  );
}
