import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import TopicQuestionsPage from "./components/TopicQuestionsPage";
import Comments from "./components/Comments";
import QuestionAnswers from "./components/QuestionAnswers";
import { useModal } from "./context/Modal";
import ConfirmDelete from "./components/QuestionModal/ConfirmDelete";
import GetTopics from "./components/GetTopics";
import MainLayout from "./components/MainLayout";

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [questionId, setQuestionId] = useState(null);

  const [allQuestions, setAllQuestions] = useState([]);
  const { setModalContent } = useModal();

  const handleAddQuestion = (newQuestion) => { // stays here, passed handleAddQuestions as prop to navigation
    setAllQuestions([...allQuestions, newQuestion]);
  };


  const onUpdateQuestion = (updatedQuestion) => { // pass as prop to QuestionAnswer qid, (now defining in QA)
    console.log('onUpdateQuestion called in App', updatedQuestion)
    setAllQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === updatedQuestion.id ? updatedQuestion : question
      )
    );
  };

  const onDeleteQuestion = (deletedQuestionId) => {// pass as prop to QuestionAnswer qid
    setAllQuestions((currentQuestions) =>
      currentQuestions.filter((question) => question.id !== deletedQuestionId)
    );
  };

  const openDeleteModal = (questionId) => {
    console.log("Opening delete modal for question ID:", questionId); //pass as prop to QuestionAnswer qid
    setModalContent(
      <ConfirmDelete
        itemType="question"
        questionId={questionId}
        onDeletionSuccess={() => onDeleteQuestion(questionId)}
      />
    );
  };

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);



  useEffect(() => {
    // get all questions. stays here. pass allQuestions prop Mainlayout -->  QuestionAnswers
    //uses fetchAllQuestions
    (async function () {
      const allQuestionsData = await fetchAllQuestions();
      setAllQuestions(allQuestionsData);
    })();
  }, []);

  useEffect(() => {
    // gets questionId, use in App.js, stays here. questionId passed as prop to navigation,
    // uses local state, no extra fetch needed
    // MainLoyout -->  QuestionAnswers
    (async function () {
      const questionObj = {};
      for (let question of allQuestions) {
        questionObj.id = question.id;
      }
      setQuestionId(questionObj.id);
    })();
  }, []);

  const fetchAllQuestions = async () => {
    //fetch for all questions, used for allQuestions
    try {
      const res = await fetch("/api/questions");
      if (res.ok) {
        const data = await res.json();
        return data.questions;
      } else {
        console.error("Failed to fetch questions. Status:", res.status);
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      return [];
    }
  };

  console.log("question from App.js****", questionId);
  console.log("onUpdateQuestion in App", onUpdateQuestion);

  return (
    <>
      <Navigation
        isLoaded={isLoaded}
        onAddQuestion={handleAddQuestion}
        user={sessionUser}
      />
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
          <ProtectedRoute path="/" exact>
            <MainLayout
            onUpdateQuestion={onUpdateQuestion}// MainLayout --> QuestionAnswers --> AddQuestion
            onDeleteQuestion={onDeleteQuestion}
            openDeleteModal={openDeleteModal}
            allQuestions={allQuestions}
            questionId={questionId}
            />
          </ProtectedRoute>
        </Switch>
      )}
    </>
  );
}

export default App;
