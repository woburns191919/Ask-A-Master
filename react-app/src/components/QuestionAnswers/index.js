import { useEffect, useState } from "react";
import { thunkGetAllUsers } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import "./questionAnswerStyles.css";

import ellipsis from "../../images/ellipsis.png";
import magnusProfile from "../../images/magnus-profile.png"
import OpenModalButton from "../OpenModalButton";
import AddQuestionForm from "../QuestionModal/AddQuestion";
import { useHistory } from "react-router-dom";
import { useBookmarkContext } from "../../context/BookmarkContext";

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
    '1': magnusProfile,
    '2': '/images/user2.png',
    '3': '/images/user3.png',
   
  };

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * profileImages.length);
    return profileImages[randomIndex];
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
        .map((question, index) => (
          <div
            className="question-answer-box"
            key={index}
            onClick={(e) => handleBoxClick(question.id, e)}
          >
            <h5>{question.title}</h5>
            <img src={getRandomImage()} className="user-profile-image" />
            <div className="question-box comment-text">
              Posted by{" "}
              <span className="user-name">
                {
                  users[0]?.find(
                    (user) => user.id === parseInt(question.user_id)
                  )?.first_name
                }
              </span>
              <br></br>
              ELO Rating{" "}
              <span className="user-name">
                {
                  users[0]?.find(
                    (user) => user.id === parseInt(question.user_id)
                  )?.elo_rating
                }
              </span>
              <br></br>
              Country{" "}
              <span className="user-name">
                {
                  users[0]?.find(
                    (user) => user.id === parseInt(question.user_id)
                  )?.country
                }
              </span>
              <p>{question.body}</p>
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
                    <button onClick={() => handleUnsavedQuestion(question.id)}>
                      Remove Bookmark
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
    </>
  );
}
