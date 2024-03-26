import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams } from "react-router-dom";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import SavedQuestions from "./components/SavedQuestions";
import TopicPage from "./components/TopicPage/TopicPage";
import Comments from "./components/Comments";
import { useModal } from "./context/Modal";
import ConfirmDelete from "./components/QuestionModal/ConfirmDelete";
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
  const [questionId, setQuestionId] = useState(null);

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


  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);


  useEffect(() => {
    fetchAllQuestions(); // necessary for initially populating the list of question when the app loads
   //refactor: could be moved to MainLayout for closer proximity to where questions are displayed
   //to enhance modularity and component autonomy--same with other functions that have the same refactor note
  }, []);

  const handleAddQuestion = (newQuestion) => {
    setAllQuestions(prevQuestions => [...prevQuestions, newQuestion]);  // reflects addition of new question in UI, shared with navbar and MainLayout
  };


  const onUpdateQuestion = (updatedQuestion) => { //updates allQuestions state (an array) to reflect changes to existing question -- holds all questions displayed in the UI
    //refactor: could be moved to MainLayout if structure stays the same
    //reason to keep it here: if I want to 'my questions' page a user can update from
    setAllQuestions(
      allQuestions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      )
    );
  };

  //results in a new array of questions where the question with the matching 'id' is being updated, which triggers a re-render

  const onDeleteQuestion = (deletedQuestionId) => { //updates state by removing a question
    //refactor: could be moved to MainLayout, if structure stays the same
    //reason to keep it here: if I want to have a 'my questions' page a user can delete from
    setAllQuestions(allQuestions.filter((q) => q.id !== deletedQuestionId));
  };

  const openDeleteModal = (questionId) => {
    setModalContent(
      <ConfirmDelete
        itemType="question"
        questionId={questionId} // id of question to delete, passed to ConfirmDelete so it knows what's being deleted
        onDeletionSuccess={() => onDeleteQuestion(questionId)} // cb ConfirmDelete will call if deletion is confirmed and successfully processed, updating state to remove question
      />
    );
  };

  const updateSearchResults = (newResults) => {
    setSearchResults(newResults);
  };


  return (
    <>
      <Navigation
        isLoaded={isLoaded}
        onAddQuestion={handleAddQuestion} // needed to lift state to make handleAddQuestion available to my navbar and landing page
        user={sessionUser}
        updateSearchResults={updateSearchResults} //see above note
      />
      {isLoaded && (
        <Switch>
          <Route path="/login" component={LoginFormPage} />
          <Route path="/signup" component={SignupFormPage} />

          <Route exact path="/topics/:id" component={TopicPage} />

          <Route exact path="/questions/:id">
            <CommonLayout>
              <Comments />
            </CommonLayout>
          </Route>
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
          <Route exact path="/search-results">
            <CommonLayout>
              <SearchResults searchResults={searchResults} />
            </CommonLayout>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
