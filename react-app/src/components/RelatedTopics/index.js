import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function RelatedTopics({ showAds }) {
  const [allTopics, setAllTopics] = useState([]);

  useEffect(() => {
    if (!showAds) {
      fetchAllTopics();
    }
  }, [showAds]);

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

  const renderTopicsOrAds = () => {
    return showAds ? (
      <>
        <div className="related-topics-box ad-box">
          <p>Ad 1</p>
        </div>
        <div className="related-topics-box ad-box">
          <p>Ad 2</p>
        </div>
      </>
    ) : (
      allTopics.map((topic, i) => (
        <div className="related-topics-box topic-box" key={i}>
          <Link to={`/topics/${topic.id}`}>{topic.name}</Link>
          <p className="followers">{Math.floor(Math.random() * 1000)} k followers</p>
        </div>
      ))
    );
  };

  return (
    <main className="related-topics-main-container">
      {renderTopicsOrAds()}
    </main>
  );
}
