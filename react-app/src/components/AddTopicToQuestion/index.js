import React, { useState, useEffect } from 'react';

const AddTopicToQuestion = ({ questionId }) => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(''); 
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch('/api/topics');
        if (!response.ok) throw new Error('Problem fetching topics');
        const data = await response.json();
        setTopics(data.topics);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);


  const handleAddTopic = async () => {
    if (!selectedTopic) return;

    try {
      const response = await fetch(`/api/questions/${questionId}/add_topic/${selectedTopic}`, {
        method: 'POST',

      });

      if (!response.ok) throw new Error('Problem adding topic to question');

    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  return (
    <div>
      <select value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}>
        <option value="">Select a Topic</option>
        {topics.map(topic => (
          <option key={topic.id} value={topic.id}>{topic.name}</option>
        ))}
      </select>
      <button onClick={handleAddTopic}>Add Topic</button>
    </div>
  );
};

export default AddTopicToQuestion;
