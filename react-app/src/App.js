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

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [questionId, setQuestionId] = useState(null);

  const [allQuestions, setAllQuestions] = useState([]);
  const [answersForQuestions, setAnswersForQuestions] = useState({});
  const { setModalContent } = useModal();

  const handleAddQuestion = (newQuestion) => {
    setAllQuestions([...allQuestions, newQuestion]);
  };

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    (async function () {
      const allQuestionsData = await fetchAllQuestions();
      const questionObj = {};
      for (let question of allQuestions) {
        questionObj.id = question.id;
      }
      setAllQuestions(allQuestionsData);
      setQuestionId(questionObj.id);
    })();
  }, []);

  const fetchAllQuestions = async () => {
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
  const fetchAnswersForQuestion = async (questionId) => {
    try {
      const res = await fetch(`/api/questions/${questionId}/answers`);
      if (res.ok) {
        const data = await res.json();
        return data.answers;
      } else {
        console.error(
          "Failed to fetch answers for the question. Status:",
          res.status
        );
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch answers for the question:", error);
      return [];
    }
  };

  useEffect(() => {
    (async function () {
      const allQuestionsData = await fetchAllQuestions();
      setAllQuestions(allQuestionsData);

      const answersData = {};
      for (const question of allQuestionsData) {
        const answers = await fetchAnswersForQuestion(question.id);
        answersData[question.id] = answers;
      }
      setAnswersForQuestions(answersData);
    })();
  }, []);

  const handleUpdateQuestion = (updatedQuestion) => {
    setAllQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === updatedQuestion.id ? updatedQuestion : question
      )
    );
  };

  const onDeleteQuestion = (deletedQuestionId) => {
    setAllQuestions((currentQuestions) =>
      currentQuestions.filter((question) => question.id !== deletedQuestionId)
    );
  };

  const openDeleteModal = (questionId) => {
    console.log("Opening delete modal for question ID:", questionId);
    setModalContent(
      <ConfirmDelete
        itemType="question"
        questionId={questionId}
        onDeletionSuccess={() => onDeleteQuestion(questionId)}
      />
    );
  };

  return (
    <>
      <Navigation
        isLoaded={isLoaded}
        onAddQuestion={handleAddQuestion}
        questionId={questionId}
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

            <GetTopics />
            <QuestionAnswers
              allQuestions={allQuestions}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={onDeleteQuestion}
              openDeleteModal={openDeleteModal}
              questionId={questionId}
            />
          </ProtectedRoute>
        </Switch>
      )}
    </>
  );
}

export default App;
