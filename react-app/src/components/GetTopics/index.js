import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import CreateTopicForm from "../CreateTopic/CreateTopicForm";

import "./styles.css";

export default function GetTopics({ onTopicCreated }) {
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
  }

  useEffect(() => {
    (async function () {
      // console.log("Fetching topics...");
      const topicsData = await fetchAllTopics();
      // console.log("Fetched topics:", topicsData);
      setAllTopics(topicsData);
    })();
  }, []);

  return (
    <main className="topics-main-container">
    {/* Add Create Space option */}
    <div className="create-topic-option">
      {/* <FaPlus className="create-topic-icon" /> */}
      <OpenModalButton

            buttonText="Create Space"
            modalComponent={<CreateTopicForm
            onTopicCreated={onTopicCreated}
            style={{ backgroundColor: '#b92b27', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 15px', cursor: 'pointer' }}/>}
          />
    </div>
      {allTopics.map((topic, i) => (
        <div className="topics-box" key={i}>
          <div className="topics">
            <Link to={`/topics/${topic.id}`}>{topic.name}</Link>
          </div>
        </div>
      ))}
    </main>
  );
}
