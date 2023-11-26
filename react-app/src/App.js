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
import CommonLayout from "./components/CommonLayout";

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [images, setImages] = useState([]);
  const { setModalContent } = useModal();
  const [searchResults, setSearchResults] = useState([]);

  // Add the missing declarations
  const [questionId, setQuestionId] = useState(null);  // For handling question ID

  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    fetchAllQuestions();
  }, []);

  const handleAddQuestion = (newQuestion) => {
    setAllQuestions([...allQuestions, { ...newQuestion, image_filename: newQuestion.image_filename }]);
  };

  const onUpdateQuestion = (updatedQuestion) => {
    setAllQuestions(allQuestions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
  };

  const onDeleteQuestion = (deletedQuestionId) => {
    setAllQuestions(allQuestions.filter(q => q.id !== deletedQuestionId));
  };

  const openDeleteModal = (questionId) => {
    setModalContent(
      <ConfirmDelete
        itemType="question"
        questionId={questionId}
        onDeletionSuccess={() => onDeleteQuestion(questionId)}
      />
    );
  };

  const updateSearchResults = (newResults) => {
    setSearchResults(newResults);
  };

  const fetchAllQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      if (res.ok) {
        const data = await res.json();
        setAllQuestions(data.questions);
      } else {
        console.error("Failed to fetch questions.");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/questions/images");
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        console.error("Failed to fetch images.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };


  return (
    <>
      <Navigation isLoaded={isLoaded} onAddQuestion={handleAddQuestion} user={sessionUser} updateSearchResults={updateSearchResults} />
      {isLoaded && (
        <Switch>
          <Route path="/login" component={LoginFormPage} />
          <Route path="/signup" component={SignupFormPage} />
          <Route exact path="/topics/:id" component={TopicPage} />
          <Route exact path="/questions/:id" component={Comments} />
          <ProtectedRoute path="/" exact>
            <CommonLayout>
              <MainLayout
                allQuestions={allQuestions}
                onUpdateQuestion={onUpdateQuestion}
                onDeleteQuestion={onDeleteQuestion}
                openDeleteModal={openDeleteModal}
                questionId={questionId}
                images={images}
                handleQuestionsUpdate={fetchAllQuestions}
                handleAddQuestion={handleAddQuestion}
              />
            </CommonLayout>
          </ProtectedRoute>
          <Route path="/saved-questions">
            <CommonLayout>
              <SavedQuestions userId={sessionUser?.id} images={images} />
            </CommonLayout>
          </Route>
          <Route exact path="/search-results" component={SearchResults} />
        </Switch>
      )}
    </>
  );
}

export default App;

// Component for rendering topic specific page
const TopicPage = () => {
  const { id: topicId } = useParams();
  const [topicQuestions, setTopicQuestions] = useState([]);

  useEffect(() => {
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
    <CommonLayout>
      <MainLayout allQuestions={topicQuestions} />
    </CommonLayout>
  );
};
