import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styles.css"; // Import the same stylesheet

const TopicQuestionsPage = ({ topicQuestions }) => {
  console.log('topic questions prop', topicQuestions)
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const getTopicIcon = (topicName) => {
    switch (topicName) {
      case "middleGameImage":
        return middleGameImage;
      case "fischer":
        return fischer;

      default:
        return blunders;
    }
  };

  const fetchQuestionsByTopic = async () => {
    try {
      const res = await fetch(`/api/topics/${id}/questions`);
      console.log('res from topic question', res)
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
                  <img
                    src={getTopicIcon(topic.name)}
                    alt={topic.name}
                    className="topic-icon"
                  />
                  <Link to={`/topics/${topic.id}`}>{topic.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="answer-box">
            <h3>{selectedTopic ? selectedTopic.name : ""}</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {questions.map((question, index) => (
                <li key={index}>
                  <h4>{question.body}</h4>
                  <ul>
                    {question.answers?.map((answer, i) => (
                      <li key={i}>{answer.content}</li>
                    ))}
                  </ul>
                  {console.log('image filename', question.image_filename)}
                  {question.image_filename && (
                    <img
                      className="photos"
                      src={`/${question.image_filename}`}
                      alt="Related"
                      style={{ height: "400px" }}
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
