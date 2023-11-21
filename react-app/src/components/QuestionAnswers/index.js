import { useEffect, useState } from "react";
import { thunkGetAllUsers } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import middleGameImage from "../../images/images.png";
import fischer from "../../images/fischer.png";
import endGame from "../../images/endGame.png";
import platforms from "../../images/platforms.jpg";
import analysis from "../../images/analysis.png";
import structure from "../../images/structure.jpg";
import blunders from "../../images/blunder.png";
import ellipsis from "../../images/ellipsis.png";
import OpenModalButton from "../OpenModalButton";
import AddQuestionForm from "../QuestionModal/AddQuestion";
import { useHistory } from "react-router-dom";


export default function QuestionAnswers({ allQuestions, answersForQuestions, onUpdateQuestion, openDeleteModal }) {
  // console.log('onUpdateQuestion prop in QA***', onUpdateQuestion)

  const [showDropdown, setShowDropdown] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const [savedQuestions, setSavedQuestions] = useState([])


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
    // Prevent routing if the ellipsis or any of its children is clicked
    if (event.target.closest(".ellipsis-container")) {
      return;
    }
    history.push(`/questions/${questionId}`);
  };

  const handleSaveQuestion = async (questionId) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/save`, {
        method: 'POST',
      });
      history.push('/saved-questions')
      if (!response.ok) throw new Error('Failed to save the question');

    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleUnsavedQuestion = async (questionId) => {

    const updatedQuestions = savedQuestions.filter(q => q.id !== questionId);
    setSavedQuestions(updatedQuestions);

    try {
      const response = await fetch(`/api/questions/${questionId}/unsave`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // If the request fails, revert the change in the local state and show an error
        setSavedQuestions(savedQuestions);
        console.error('Failed to unsave the question');

      }
    } catch (error) {
      console.error('Error unsaving question:', error);

      setSavedQuestions(savedQuestions);

    }
  };






  // console.log('questionId from question answers', questionId)

  return (
    <main className="main-container">
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
            <div className="question-box comment-text">
              Posted by <span className="user-name">
                {question.user_id === sessionUser?.id
                  ? sessionUser?.first_name
                  : users[0]?.find((user) => user.id === question.user_id)
                      ?.first_name}
              </span>
              <p>{question.body}</p>
            </div>
            <div className="answer-box">
              {answersForQuestions && answersForQuestions[question.id]?.map((answer, i) => (
                <p key={i}>{answer.content}</p>
              ))}

              {/* {randomChessImage && (
                <img
                  className="photos"
                  src={randomChessImage}
                  alt="random-chess-image"
                  style={{ height: "150px", width: "250px" }}
                />
              )} */}

              {question.body.includes("Defense") && (
                <img
                  className="photos"
                  src={middleGameImage}
                  alt="middle-game"
                  style={{ height: "170px"}}
                />
              )}
              {question.body.includes("books") && (
                <img
                  className="photos"
                  src={fischer}
                  alt="fischer"
                  style={{ height: "170px"}}
                />
              )}
              {question.body.includes("endgame") && (
                <img
                  className="photos"
                  src={endGame}
                  alt="endgame"
                  style={{ height: "170px"}}
                />
              )}
              {question.body.includes("platforms") && (
                <img
                  className="photos"
                  src={platforms}
                  alt="platforms"
                  style={{ height: "150px"}}
                />
              )}
              {question.body.includes("analysis") && (
                <img
                  className="photos"
                  src={analysis}
                  alt="analysis"
                  style={{ height: "170px"}}
                />
              )}
              {question.body.includes("blunders") && (
                <img
                  className="photos"
                  src={blunders}
                  alt="analysis"
                  style={{ height: "170px" }}
                />
              )}
              {question.body.includes("structure") && (
                <img
                  className="photos"
                  src={structure}
                  alt="structure"
                  style={{ height: "170px"}}
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
                          />
                        }
                      />
                      <button onClick={() => openDeleteModal(question.id)}>
                        Delete question
                      </button>
                    </>
                  )}
                   <button onClick={() => handleSaveQuestion(question.id)}>Bookmark</button>
                   <button onClick={() => handleUnsavedQuestion(question.id)}>Remove bookmark</button>

                </div>
              )}
            </div>
          </div>
        ))}
    </main>
  );
}
