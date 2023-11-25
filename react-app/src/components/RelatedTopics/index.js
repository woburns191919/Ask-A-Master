import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function RelatedTopics() {
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
    <main className="related-topics-main-container">
      <p className="topic-header">Related Topics</p>

      {allTopics.map((topic, i) => (
        <div className="related-topics-box" key={i}>
          <div className="topics">
            <Link to={`/topics/${topic.id}`}>{topic.name}</Link>
            <p className="followers">{Math.floor(Math.random() * 1000)} k followers</p>
          </div>
        </div>
      ))}
    </main>
  );
}
