import React, { useState } from 'react';
import axios from 'axios';

const GPTConversation = () => {
  const [prompt, setPrompt] = useState('');
  const [gptResponse, setGptResponse] = useState('');

  const sendPrompt = async () => {
    try {
      const response = await axios.post('/api/gpt-response', { prompt });
      setGptResponse(response.data.response);
    } catch (error) {
      console.error('Error fetching GPT response:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type a question or prompt"
      />
      <button onClick={sendPrompt}>Send</button>

      <div>
        <h3>GPT Response:</h3>
        <p>{gptResponse}</p>
      </div>
    </div>
  );
};

export default GPTConversation;
