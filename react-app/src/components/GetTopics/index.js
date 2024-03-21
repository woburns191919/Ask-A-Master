import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateTopicForm from "../CreateTopic/CreateTopicForm";

import { useModal } from "../../context/Modal";

import "./styles.css";

export default function GetTopics() {
  const [allTopics, setAllTopics] = useState([]);
  const { setModalContent } = useModal();

  const getIconForTopic = (topicName) => {
    switch (topicName.toLowerCase()) {
      case "chess books and resources":
        return "fa fa-book";
      case "avoiding blunders":
        return "fa fa-times-circle";
      case "chess analysis":
        return "fa fa-search";
      case "tactics and combinations":
        return "fa fa-puzzle-piece";
      case "endgame techniques":
        return "fa fa-flag-checkered";
      case "middle game strategy":
        return "fa fa-chess-knight";
      case "opening theory":
        return "fa fa-play-circle";
      default:
        return "fa fa-star";
    }
  };

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
      const topicsData = await fetchAllTopics();

      setAllTopics(topicsData);
    })();
  }, []);

  useEffect(() => {}, [allTopics]);

  const handleOpenModalClick = () => {
    setModalContent(<CreateTopicForm addNewTopic={addNewTopic} />);
  };

  return (
    <main className="topics-main-container">
      {/* <div className="create-topic-option" onClick={handleOpenModalClick}>
        <i className="fa fa-plus create-topic-icon" />
        <span className="create-topic-text">Create Space</span>
      </div> */}
      {allTopics
        ?.concat()
        .reverse()
        .map((topic, i) => (
          <Link
            to={`/topics/${topic.id}`}
            key={topic.id}
            className="topic-link"
          >
            <div className="topics-box">
              <div className="topics selected-topic">
                <i className={getIconForTopic(topic.name)} />
                <span>{topic.name}</span>
              </div>
            </div>
          </Link>
        ))}
    </main>
  );
}
