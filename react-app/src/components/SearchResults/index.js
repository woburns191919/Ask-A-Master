import React from "react";
import { NavLink } from "react-router-dom";
import ProfileButton from "../../components/Navigation/ProfileButton";
import ellipsis from "../../images/ellipsis.png";
import GetTopics from "../GetTopics";
import RelatedTopics from "../RelatedTopics";
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
    <main className="main-container">
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">
          <GetTopics />
        </div>

        <div className="center-content">
          <div className="search-results-container">
            {renderQuestionsAndAnswers(
              searchResults?.questions,
              searchResults?.answers
            )}
        
          </div>
        </div>

        <div className="related-topics-main-container">
          <RelatedTopics showAds={true} />
        </div>
      </div>
    </main>
  );
};

export default SearchResultsComponent;
