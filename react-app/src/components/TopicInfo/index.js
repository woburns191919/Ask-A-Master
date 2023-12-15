import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";

function TopicInfo() {
  const { id: topicId } = useParams();
  const [topicInfo, setTopicInfo] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const fetchTopicInfo = async () => {
      try {
        const response = await fetch(`/api/topics/${topicId}`);
        if (response.ok) {
          const data = await response.json();
          setTopicInfo(data.topic);
          setFollowerCount(Math.floor(Math.random() * 1000));
        } else {
          console.error("Failed to fetch topic info. Status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching topic info:", error);
      }
    };

    if (topicId) {
      fetchTopicInfo();
    }
  }, [topicId]);

  if (!topicInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="topic-info-container">
      <h2>{topicInfo.name}</h2>
      <p className="followers">Followers: {followerCount}k</p>
    </div>
  );
}

export default TopicInfo;
