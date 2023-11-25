import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import CreateTopicForm from "../CreateTopic/CreateTopicForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


import "./styles.css";

export default function GetTopics() {
  const [allTopics, setAllTopics] = useState([]);

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
    console.log("OpenModalButton clicked");
  };

  return (
    <main className="topics-main-container">
      {/* Add Create Space option */}
      <div className="create-topic-option">
      <FontAwesomeIcon icon={faPlus} className="create-topic-icon" />
        {/* <FaPlus className="create-topic-icon" /> */}
        <OpenModalButton
          buttonText="Create Space"
          modalComponent={
            <CreateTopicForm addNewTopic={addNewTopic}
            />
          }
          onButtonClick={handleOpenModalClick}
        />

      </div>
      {allTopics ?.concat()
        .reverse()
        .map((topic, i) => (
        <div className="topics-box" key={topic.id}>
          <div className="topics">
            <Link to={`/topics/${topic.id}`}>{topic.name}</Link>
          </div>
        </div>
      ))}
    </main>
  );
}
