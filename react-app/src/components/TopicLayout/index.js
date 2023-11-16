// import React from 'react';
// import GetTopics from '../GetTopics';
// import QuestionAnswers from '../QuestionAnswers';
// import './styles.css';


const TopicLayout = () => {
  const { id: topicId } = useParams();
  const [topicQuestions, setTopicQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions specific to a topic
    const fetchQuestionsByTopic = async () => {
      try {
        const res = await fetch(`/api/topics/${topicId}/questions`);
        if (res.ok) {
          const data = await res.json();
          setTopicQuestions(data.questions);
        }
      } catch (error) {
        console.error('Error fetching topic questions:', error);
      }
    };

    fetchQuestionsByTopic();
  }, [topicId]);

  return (
    <MainLayout
      allQuestions={topicQuestions}
      // Other necessary props here
    />
  );
};
