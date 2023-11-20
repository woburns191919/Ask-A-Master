// SavedQuestions.js

import React, { useState, useEffect } from "react";

const SavedQuestions = ({ userId }) => {
  console.log('user id from sq', userId)
  const [savedQuestions, setSavedQuestions] = useState([]);

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/saved_questions`);
        console.log('response from sq', response)
        if (!response.ok) throw new Error('Failed to fetch saved questions');
        const data = await response.json();
        setSavedQuestions(data);
      } catch (error) {
        console.error('Error fetching saved questions:', error);
      }
    };

    fetchSavedQuestions();
  }, [userId]);

  return (
    <div>
      <h2>Saved Questions</h2>
      {savedQuestions.map((question, index) => (
        <div key={index}>
          <h3>{question.title}</h3>
          <p>{question.body}</p>

        </div>
      ))}
    </div>
  );
};

export default SavedQuestions;
