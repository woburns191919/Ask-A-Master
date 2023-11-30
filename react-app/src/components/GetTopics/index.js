import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateTopicForm from "../CreateTopic/CreateTopicForm";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlus, faBook, faFilm, faMusic, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { useModal } from "../../context/Modal";

import "./styles.css";

export default function GetTopics() {
  const [allTopics, setAllTopics] = useState([]);
  const { setModalContent } = useModal();

  // const topicIcons = {
  //   "Books": faBook,
  //   "Music": faMusic,
  //   "Movies": faFilm,
  // };

  // const getDefaultIcon = () => faQuestionCircle;

  const fetchAllTopics = async () => {
    try {
      const res = await fetch("/api/topics");
      if (res.ok) {
        const data = await res.json();
        return data.topics;
      } else {
        console.error("Failed to fetch topics. Status:", res.status);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      return [];
    }
  };

  const addNewTopic = (newTopic) => {
    setAllTopics((prevTopics) => [...prevTopics, newTopic]);
  };

  useEffect(() => {
    (async function () {
      console.log("Fetching topics...");
      const topicsData = await fetchAllTopics();
      console.log("Fetched topics:", topicsData);
      setAllTopics(topicsData);
    })();
  }, []);

  useEffect(() => {
    console.log("Updated topics list in GetTopics:", allTopics);
  }, [allTopics]);

  const handleOpenModalClick = () => {
    setModalContent(<CreateTopicForm addNewTopic={addNewTopic} />);
  };

  return (
    <main className="topics-main-container">
      <div className="create-topic-option" onClick={handleOpenModalClick}>
        <i className="fa fa-plus create-topic-icon" />
        <span className="create-topic-text">Create Space</span>
      </div>
      {allTopics ?.concat().reverse().map((topic, i) => (
        <Link to={`/topics/${topic.id}`} key={topic.id} className="topic-link">
          <div className="topics-box">
            <div className="topics">
            <i className="fa fa-question-circle" />
              <span>{topic.name}</span>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
