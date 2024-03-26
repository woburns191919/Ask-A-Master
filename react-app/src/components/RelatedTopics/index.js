import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ad1 from "../../images/ad1.jpeg"
// import ad2 from "../../images/ad2.jpg"
import "./styles.css";

export default function RelatedTopics({ showAds }) {
  const [allTopics, setAllTopics] = useState([]);
  const [adVisible, setAdVisible] = useState(true);


  const closeAd = () => {
    setAdVisible(false);
  };


  useEffect(() => {
    if (!showAds) {
      fetchAllTopics();
    }
  }, [showAds]);

  //future plans: should fetch different topics than the ones on the left-hand list

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
      adVisible && (
        <div className="related-topics-box ad-box">
          <button className="close-ad" onClick={closeAd}>X</button>
          <img src={ad1} alt="Advertisement"/>
        </div>
      )
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
