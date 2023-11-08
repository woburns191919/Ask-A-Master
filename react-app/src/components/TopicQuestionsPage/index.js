import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styles.css"; // Import the same stylesheet

import middleGameImage from "../../images/images.png";
import fischer from "../../images/fischer.png";
import endGame from "../../images/endGame.png";
import platforms from "../../images/platforms.jpg";
import analysis from "../../images/analysis.png";
import structure from "../../images/structure.jpg";
import blunders from "../../images/blunder.png";

const TopicQuestionsPage = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const fetchQuestionsByTopic = async () => {
    try {
      const res = await fetch(`/api/topics/${id}/questions`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      } else {
        console.error(
          "Failed to fetch questions for the topic. Status:",
          res.status
        );
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
        const topic = data.topics.find((topic) => topic.id === parseInt(id));
        setSelectedTopic(topic);
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
    <main className="main-container">
      <div className="topic-question-container">
        <div className="question-answer-box">
          <div className="question-box">
            <h2>All Topics</h2>
            <ul className="topic-list">
              {" "}
              {/* Adding a new class for the topics */}
              {allTopics.map((topic) => (
                <li key={topic.id}>
                  <Link to={`/topics/${topic.id}`}>{topic.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="answer-box">
            <h3>{selectedTopic ? selectedTopic.name : ""}</h3>
            <ul>
              {questions.map((question, index) => (
                <li key={index}>
                  <h4>{question.body}</h4>
                  <ul>
                    {question.answers?.map((answer, i) => (
                      <li key={i}>{answer.content}</li>
                    ))}
                  </ul>
                  {question.body.includes("Defense") && (
                    <img
                      src={middleGameImage}
                      alt="middle game"
                      className="photos"
                    />
                  )}
                  {question.body.includes("books") && (
                    <img src={fischer} alt="fischer" className="photos" />
                  )}
                  {question.body.includes("endgame") && (
                    <img src={endGame} alt="endgame" className="photos" />
                  )}
                  {question.body.includes("platforms") && (
                    <img
                      src={platforms}
                      alt="platforms"
                      className="photos"
                    />
                  )}
                  {question.body.includes("analysis") && (
                    <img
                      src={analysis}
                      alt="analysis"
                      className="photos"
                    />
                  )}
                  {question.body.includes("blunders") && (
                    <img
                      src={blunders}
                      alt="blunders"
                      className="photos"
                    />
                  )}
                  {question.body.includes("structure") && (
                    <img
                      src={structure}
                      alt="structure"
                      className="photos"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TopicQuestionsPage;
