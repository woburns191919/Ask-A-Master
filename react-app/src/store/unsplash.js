// import { csrfFetch } from "./csrf";

const LOAD_API_KEY = "unsplash/LOAD_API_KEY";

const loadApiKey = (key) => ({
  type: LOAD_API_KEY,
  payload: key,
});

export const getKey = () => async (dispatch) => {
  console.log("getKey action started");

  try {
    const response = await fetch("/api/unsplash/key", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
    });

    console.log('response', response)

    if (response.ok) {
      const data = await response.json();
      console.log("Dispatching loadApiKey action with payload: ", data.AIUnsplashAPIKey);
      dispatch(loadApiKey(data.AIUnsplashAPIKey));
    } else {
      console.error("Failed to fetch API Key: ", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching API Key: ", error);
  }
};


const initialState = { key: null };

const unsplashReducer = (state = initialState, action) => {
  console.log("Reducer action received: ", action);
  switch (action.type) {
    case LOAD_API_KEY:
      console.log("Updating state with API key: ", action.payload);
      return { key: action.payload };
    default:
      return state;
  }
};

export default unsplashReducer;
