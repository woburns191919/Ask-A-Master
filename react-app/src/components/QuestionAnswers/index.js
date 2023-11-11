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
// import axios from "axios";
import OpenModalButton from "../OpenModalButton";
import AddQuestionForm from "../QuestionModal/AddQuestion";

export default function QuestionAnswers() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [answersForQuestions, setAnswersForQuestions] = useState({});
  // const [randomChessImage, setRandomChessImage] = useState("");
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // const UnsplashAccessKey = "sEqk1GS_E6oKdR_J2aJGBVGeIc-bxELWHjl_xGB8jq0";

  const users = Object.values(
    useSelector((state) =>
      state.session.allUsers ? state.session.allUsers : []
    )
  );

  const sessionUser = useSelector((state) => state.session.user);

  // const fetchRandomChessImage = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://api.unsplash.com/photos/random",
  //       {
  //         params: {
  //           query: "chess",
  //           orientation: "landscape",
  //         },
  //         headers: {
  //           Authorization: `Client-ID ${UnsplashAccessKey}`,
  //         },
  //       }
  //     );

  //     const imageUrl = response.data.urls.regular;
  //     setRandomChessImage(imageUrl);
  //   } catch (error) {
  //     console.error("Failed to fetch random chess image:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchRandomChessImage();
  // }, []);

  const fetchAllQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      // console.log('res??', res)
      if (res.ok) {
        const data = await res.json();
        // console.log('questions', data.questions)
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

  console.log('user questions', allQuestions.find(question => question.user_id == sessionUser.id))
  console.log('session user', sessionUser)

  return (
    <main className="main-container">
      {allQuestions
        ?.concat()
        .reverse()
        .map((question, index) => (
          <div className="question-answer-box" key={index}>
            <div className="question-box">
              <h5 className="user-name">
                {question.user_id == sessionUser?.id
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
            {question.user_id === sessionUser?.id &&
            <OpenModalButton
              buttonText="Edit question"
              modalComponent={<AddQuestionForm formType="Edit" questionId={question.id} />}
            />}
          </div>
        ))}
    </main>
  );
}
