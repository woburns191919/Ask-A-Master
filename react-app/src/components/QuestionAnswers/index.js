import { useEffect, useState } from "react";
import { thunkgetAllUsers } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import middleGameImage from '../../images/images.png';
import fischer from '../../images/fischer.png';
import endGame from '../../images/endGame.png';
import platforms from '../../images/platforms.jpg';
import analysis from '../../images/analysis.png';
import structure from '../../images/structure.jpg';
import blunders from '../../images/blunder.png'

export default function QuestionAnswers() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [answersForQuestions, setAnswersForQuestions] = useState({});
  const dispatch = useDispatch();

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
  }

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
  }

  const users = Object.values(
    useSelector((state) =>
      state.session.allUsers ? state.session.allUsers : []
    )
  );

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
    dispatch(thunkgetAllUsers());
  }, [dispatch]);

  return (
    <main className="main-container">
      {allQuestions?.map((question, index) => (
        <div className="question-answer-box" key={index}>
          <div className="question-box">
            <h5 className="user-name">
              {users[0]?.find((user) => user.id === question.id)?.first_name}
            </h5>
            <h4>{question.body}</h4>
          </div>
          <div className="answer-box">
            {answersForQuestions[question.id]?.map((answer, i) => (
              <p key={i}>{answer.content}</p>
            ))}

            {question.body.includes('Defense') && (
              <img className="photos" src={middleGameImage} alt="middle-game-photo" style={{ height: "150px", width: "250px"  }} />
            )}
            {question.body.includes('books') && (
              <img className="photos" src={fischer} alt="fischer-photo" style={{ height: "150px", width: "250px"  }} />
            )}
            {question.body.includes('endgame') && (
              <img className="photos" src={endGame} alt="endgame-photo" style={{ height: "150px", width: "250px"  }} />
            )}
            {question.body.includes('platforms') && (
              <img className="photos" src={platforms} alt="platforms-photo" style={{ height: "150px", width: "250px"  }} />
            )}
            {question.body.includes('analysis') && (
              <img className="photos" src={analysis} alt="analysis-photo" style={{ height: "150px", width: "250px"  }} />
            )}
            {question.body.includes('blunders') && (
              <img className="photos" src={blunders} alt="analysis-photo" style={{ height: "150px", width: "250px"  }} />
            )}
            {question.body.includes('structure') && (
              <img className="photos" src={structure} alt="structure-photo" style={{ height: "150px", width: "250px" }} />
            )}
          </div>
        </div>
      ))}
    </main>
  );
}
