import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ProfileButton from "./components/Navigation/ProfileButton";
import TopicQuestionsPage from "./components/TopicQuestionsPage";
import Comments from "./components/Comments";



function App() {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/topics/:id">
            <TopicQuestionsPage />
          </Route>
          <Route exact path="/questions/:id">
            <Comments />
          </Route>
          <ProtectedRoute path="/">
            <ProfileButton user={sessionUser} />
            <LandingPage />
          </ProtectedRoute>
        </Switch>
      )}
    </>
  );
}

export default App;
