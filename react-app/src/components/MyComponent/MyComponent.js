import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetGPTResponse } from './store/gpt';


const MyComponent = () => {
  const [prompt, setPrompt] = useState('');
  const dispatch = useDispatch();
  const gptResponse = useSelector((state) => state.gpt.gptResponse);

  const sendPrompt = async () => {
    try {
      dispatch(thunkGetGPTResponse(prompt));
    } catch (error) {
      console.error("Error dispatching GPT thunk:", error);
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

      {gptResponse && (
        <div>
          <h3>GPT Response:</h3>
          <p>{gptResponse}</p>
        </div>
      )}
    </div>
  );
};

export default MyComponent;
