import React from "react";
import "./styles.css"; // Use your existing styles

const SearchResultsComponent = ({ searchResults }) => {
  console.log("search results", searchResults);
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

  const renderQuestions = (questions) => {};

  const renderAnswers = (answers) => {};

  const renderUsers = (users) => {};

  return (
    <div className="main-layout">
      <div className="content-wrapper">
        <div className="sidebar sidebar-menu">
          <h2>Topics</h2>
          {renderTopics(searchResults.topics)}
        </div>

        <div className="content">
          <h2>Questions</h2>
          {renderQuestions(searchResults.questions)}

          <h2>Answers</h2>
          {renderAnswers(searchResults.answers)}

          <h2>Users</h2>
          {renderUsers(searchResults.users)}
        </div>

        <div className="related-topics">
          {/* Related topics or other content */}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsComponent;
