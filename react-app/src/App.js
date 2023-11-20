import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams } from "react-router-dom";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import SavedQuestions from "./components/SavedQuestions";

import Comments from "./components/Comments";

import { useModal } from "./context/Modal";
import ConfirmDelete from "./components/QuestionModal/ConfirmDelete";
import AskShareComponent from "./components/AskShareInput";
import SearchResults from "./components/SearchResults";

import MainLayout from "./components/MainLayout";

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [questionId, setQuestionId] = useState(null);

  const [allQuestions, setAllQuestions] = useState([]);
  const { setModalContent } = useModal();

  const [topics, setTopics] = useState([]);

  // const handleTopicCreated = (newTopic) => {
  //   console.log('handleTopicCreated called with:', newTopic);
  //   setTopics([...topics, newTopic]);
  // };


  const handleAddQuestion = (newQuestion) => {
    // stays here, passed handleAddQuestions as prop to navigation
    setAllQuestions([...allQuestions, newQuestion]);
  };

  const onUpdateQuestion = (updatedQuestion) => {
    // pass as prop to QuestionAnswer qid, (now defining in QA)

    setAllQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === updatedQuestion.id ? updatedQuestion : question
      )
    );
  };

  const onDeleteQuestion = (deletedQuestionId) => {
    // pass as prop to QuestionAnswer qid
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
      // const allQuestionsData = await fetchAllQuestions();
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
          console.error("Error fetching topic questions:", error);
        }
      };

      fetchQuestionsByTopic();
    }, [topicId]);

    return (
      <MainLayout
        allQuestions={topicQuestions}
        onUpdateQuestion={onUpdateQuestion}
        onDeleteQuestion={onDeleteQuestion}
        openDeleteModal={openDeleteModal}
        questionId={questionId}
      />
    );
  };

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
            <TopicLayout />
          </Route>
          <Route exact path="/questions/:id">
            <Comments />
          </Route>
          <ProtectedRoute path="/" exact>

            <MainLayout
              onUpdateQuestion={onUpdateQuestion}
              onDeleteQuestion={onDeleteQuestion}
              openDeleteModal={openDeleteModal}
              allQuestions={allQuestions}
              questionId={questionId}
              handleAddQuestion={handleAddQuestion}
              // handleTopicCreated={handleTopicCreated}

            />
          </ProtectedRoute>
          <Route path="/saved-questions">
            <SavedQuestions userId={sessionUser?.id} />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
