import { useEffect, useState } from "react";
import { thunkGetAllUsers } from "../../store/session";
import { useParams } from "react-router-dom";
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
import ConfirmDelete from "../QuestionModal/ConfirmDelete";
import { useHistory } from "react-router-dom";
import Comments from "../Comments";
import { useModal } from "../../context/Modal";

export default function QuestionAnswers() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [answersForQuestions, setAnswersForQuestions] = useState({});
  const [showDropdown, setShowDropdown] = useState(null);
  const dispatch = useDispatch();
  const { questionId } = useParams();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const history = useHistory();
  const { setModalContent } = useModal();

  const onDeleteQuestion = (deletedQuestionId) => {
    setAllQuestions((currentQuestions) =>
      currentQuestions.filter((question) => question.id !== deletedQuestionId)
    );
  };

  const openDeleteModal = (questionId) => {
    console.log("Opening delete modal for questionId:", questionId); // Debug log
    setModalContent(
      <ConfirmDelete
        itemType="question"
        questionId={questionId}
        onDeletionSuccess={() => onDeleteQuestion(questionId)}
      />
    );
  };

  const users = Object.values(
    useSelector((state) =>
      state.session.allUsers ? state.session.allUsers : []
    )
  );

  const sessionUser = useSelector((state) => state.session.user);

  const fetchAllQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      if (res.ok) {
        const data = await res.json();
        return data.questions;
      } else {
        console.error("Failed to fetch questions. Status:", res.status);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      return [];
    }
  };

  const fetchAnswersForQuestion = async (questionId) => {
    try {
      const res = await fetch(`/api/questions/${questionId}/answers`);
      if (res.ok) {
        const data = await res.json();
        return data.answers;
      } else {
        console.error(
          "Failed to fetch answers for the question. Status:",
          res.status
        );
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch answers for the question:", error);
      return [];
    }
  };

  useEffect(() => {
    (async function () {
      const allQuestionsData = await fetchAllQuestions();
      setAllQuestions(allQuestionsData);

      const answersData = {};
      for (const question of allQuestionsData) {
        const answers = await fetchAnswersForQuestion(question.id);
        answersData[question.id] = answers;
      }
      setAnswersForQuestions(answersData);
    })();
  }, []);

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
            <div className="question-box">
              <h5 className="user-name">
                {question.user_id === sessionUser?.id
                  ? sessionUser?.first_name
                  : users[0]?.find((user) => user.id === question.user_id)
                      ?.first_name}
              </h5>
              <h4>{question.body}</h4>
            </div>
            <div className="answer-box">
              {answersForQuestions[question.id]?.map((answer, i) => (
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
                  style={{ height: "150px", width: "250px" }}
                />
              )}
              {question.body.includes("books") && (
                <img
                  className="photos"
                  src={fischer}
                  alt="fischer"
                  style={{ height: "150px", width: "250px" }}
                />
              )}
              {question.body.includes("endgame") && (
                <img
                  className="photos"
                  src={endGame}
                  alt="endgame"
                  style={{ height: "150px", width: "250px" }}
                />
              )}
              {question.body.includes("platforms") && (
                <img
                  className="photos"
                  src={platforms}
                  alt="platforms"
                  style={{ height: "150px", width: "250px" }}
                />
              )}
              {question.body.includes("analysis") && (
                <img
                  className="photos"
                  src={analysis}
                  alt="analysis"
                  style={{ height: "150px", width: "250px" }}
                />
              )}
              {question.body.includes("blunders") && (
                <img
                  className="photos"
                  src={blunders}
                  alt="analysis"
                  style={{ height: "150px", width: "250px" }}
                />
              )}
              {question.body.includes("structure") && (
                <img
                  className="photos"
                  src={structure}
                  alt="structure"
                  style={{ height: "150px", width: "250px" }}
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
                            closeModal={closeDropdown}
                          />
                        }
                      />
                     <button onClick={() => openDeleteModal(question.id)}>Delete question</button>

                      {/* {console.log('Active dropdown for question.id:', question.id)} */}

                      {/* Add delete option or any other actions */}
                    </>
                  )}
                  {/* <Comments questionId={question.id} /> */}
                </div>
              )}
            </div>
          </div>
        ))}
    </main>
  );
}
