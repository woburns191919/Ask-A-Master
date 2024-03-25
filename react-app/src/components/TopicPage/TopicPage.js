// Component for rendering topic specific page
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommonLayout from "../CommonLayout";
import MainLayout from "../MainLayout";

const TopicPage = () => {
  const { id: topicId } = useParams();
  const [topicQuestions, setTopicQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestionsByTopic = async () => {
      try {
        const res = await fetch(`/api/topics/${topicId}/questions`);
        if (res.ok) {
          const data = await res.json();
          setTopicQuestions(data.questions);
        }
      } catch (error) {
        console.error("Error fetching topic questions:", error);
      }
    };
    fetchQuestionsByTopic();
  }, [topicId]);

  return (
    <CommonLayout>
      {/* rendering QuestionAnswer component from MainLayout, but topic-specific questions */}
      <MainLayout allQuestions={topicQuestions} />
    </CommonLayout>
  );
};


export default TopicPage
