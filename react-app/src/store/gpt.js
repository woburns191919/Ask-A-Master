
const GET_GPT_RESPONSE = "gpt/GET_GPT_RESPONSE";


const getGPTResponse = (response) => ({
  type: GET_GPT_RESPONSE,
  payload: response,
});


export const thunkGetGPTResponse = (prompt) => async (dispatch) => {
  try {
    const response = await fetch("/api/gpt-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('data from gpt', data)
      dispatch(getGPTResponse(data.response));
    } else {
      console.error("Failed to get GPT response");
    }
  } catch (error) {
    console.error("Error while getting GPT response:", error);
  }
};


const initialState = {
  gptResponse: "",
};


export default function gptReducer(state = initialState, action) {
  switch (action.type) {
    case GET_GPT_RESPONSE:
      return { ...state, gptResponse: action.payload };

    default:
      return state;
  }
}
