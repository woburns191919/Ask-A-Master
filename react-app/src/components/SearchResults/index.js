import React from "react";
import { NavLink } from "react-router-dom";
import ProfileButton from "../../components/Navigation/ProfileButton";
import ellipsis from "../../images/ellipsis.png";
import "./styles.css";

const SearchResultsComponent = ({ searchResults }) => {
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

  const renderQuestionsAndAnswers = (questions, answers) => {
    return questions?.length > 0 ? (
      questions.map((question) => (
        <div key={question.id} className="question-item">
          <NavLink to={`/questions/${question.id}`} className="question-link">
            {question.title}
          </NavLink>
          {answers
            .filter((answer) => answer.questionId === question.id)
            .map((answer) => (
              <div key={answer.id} className="answer-item">
                <div className="answer-user-info">
                  <ProfileButton userId={answer.userId} />
                  <div className="user-details">
                    <p className="user-name">{answer.user?.username}</p>
                  </div>
                </div>
                <p className="answer-content">{answer.content}</p>
              </div>
            ))}
        </div>
      ))
    ) : (
      <p>No questions found.</p>
    );
  };

  return (
    <div className="main-layout">
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">{/* Sidebar content */}</div>

        <div className="content">
          {renderQuestionsAndAnswers(
            searchResults?.questions,
            searchResults?.answers
          )}
        </div>

        <div className="search-page"></div>
      </div>
    </div>
  );
};

export default SearchResultsComponent;
