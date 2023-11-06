import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styles.css";


import middleGameImage from '../../images/images.png';
import fischer from '../../images/fischer.png';
import endGame from '../../images/endGame.png';
import platforms from '../../images/platforms.jpg';
import analysis from '../../images/analysis.png';
import structure from '../../images/structure.jpg';
import blunders from '../../images/blunder.png'

const TopicQuestionsPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [allTopics, setAllTopics] = useState([]);

  const fetchQuestionsByTopic = async () => {
    try {
      const res = await fetch(`/api/topics/${id}/questions`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      } else {
        console.error("Failed to fetch questions for the topic. Status:", res.status);
      }
    } catch (error) {
      console.error("Failed to fetch questions for the topic:", error);
    }
  };

  const fetchAllTopics = async () => {
    try {
      const res = await fetch("/api/topics");
      if (res.ok) {
        const data = await res.json();
        setAllTopics(data.topics);
      } else {
        console.error("Failed to fetch topics. Status:", res.status);
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  useEffect(() => {
    fetchQuestionsByTopic();
    fetchAllTopics();
  }, [id]);

  return (
    <div className="topic-questions-page">
      <div className="topic-side-panel">
        <h2>All Topics</h2>
        <ul>
          {allTopics.map((topic) => (
            <li key={topic.id}>
              <Link to={`/topics/${topic.id}`}>{topic.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="topic-questions-content">
        <h1>Questions related to the topic with ID {id}</h1>
        <ul>
          {questions.map((question) => (
            <li key={question.id}>
              <h3>{question.body}</h3>
              <ul>
                {question.answers?.map((answer) => (
                  <li key={answer.id}>{answer.content}</li>
                ))}
              </ul>

              {question.body.includes("Defense") && (
                <img
                  src={middleGameImage}
                  alt="Middle Game Photo"
                  className="question-image"
                />
              )}
              {question.body.includes("books") && (
                <img
                  src={fischer}
                  alt="Fischer Photo"
                  className="question-image"
                />
              )}
              {question.body.includes("endgame") && (
                <img
                  src={endGame}
                  alt="Endgame Photo"
                  className="question-image"
                />
              )}
              {question.body.includes("platforms") && (
                <img
                  src={platforms}
                  alt="Platforms Photo"
                  className="question-image"
                />
              )}
              {question.body.includes("analysis") && (
                <img
                  src={analysis}
                  alt="Analysis Photo"
                  className="question-image"
                />
              )}
              {question.body.includes("blunders") && (
                <img
                  src={blunders}
                  alt="Blunders Photo"
                  className="question-image"
                />
              )}
              {question.body.includes("structure") && (
                <img
                  src={structure}
                  alt="Structure Photo"
                  className="question-image"
                />
              )}

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopicQuestionsPage;
