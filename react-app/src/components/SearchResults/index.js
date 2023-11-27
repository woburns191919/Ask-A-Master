import React from "react";
import { NavLink } from "react-router-dom";
import ProfileButton from "../../components/Navigation/ProfileButton"
import ellipsis from "../../images/ellipsis.png";
import "./styles.css"; // Use your existing styles

const SearchResultsComponent = ({ searchResults }) => {
  console.log("search results****", searchResults);
  const renderTopics = (topics) => {
    return topics?.length > 0 ? (
      topics.map((topic) => (
        <div key={topic.id} className="result-item">
          <p>{topic.name}</p>
        </div>
      ))
    ) : (
      <p>No topics found.</p>
    );
  };
  const renderQuestions = (questions) => {
    return questions?.length > 0 ? (
      questions.map((question) => (
        <div key={question.id} className="question-item">
          <NavLink to={`/questions/${question.id}`} className="question-link">
            {question.title}
          </NavLink>
          {/*  more details */}
        </div>
      ))
    ) : (
      <p>No questions found.</p>
    );
  };

  const renderAnswers = (answers) => {
    return answers?.length > 0 ? (
      answers.map((answer) => (
        <div key={answer.id} className="answer-item">
          <div className="answer-user-info">
            <ProfileButton userId={answer.userId} />{" "}
            {/* Replace with actual user profile component */}
            <div className="user-details">
              <p className="user-name">{answer.user?.username}</p>
              <p className="user-qualifications">
                {/* {answer.user.qualifications} */}
              </p>
            </div>
          </div>
          <p className="answer-content">{answer.content}</p>
          {/* Add ellipsis dropdown here */}
        </div>
      ))
    ) : (
      <p>No answers found.</p>
    );
  };

  return (
    <div className="main-layout">
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">
          <h2>Topics</h2>
          {renderTopics(searchResults?.topics)}
        </div>

        <div className="content">
          <h2>Questions</h2>
          {renderQuestions(searchResults?.questions)}

          <h2>Answers</h2>
          {renderAnswers(searchResults?.answers)}


        </div>

        <div className="related-topics">
          {/* Placeholder for related topics or other content */}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsComponent;
