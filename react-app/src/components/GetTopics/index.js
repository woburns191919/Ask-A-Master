import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  }

  useEffect(() => {
    (async function () {
      console.log("Fetching topics...");
      const topicsData = await fetchAllTopics();
      console.log("Fetched topics:", topicsData);
      setAllTopics(topicsData);
    })();
  }, []);

  return (
    <main className="topics-main-container">
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
