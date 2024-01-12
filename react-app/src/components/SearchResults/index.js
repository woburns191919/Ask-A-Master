import React from "react";
import { NavLink } from "react-router-dom";
import ProfileButton from "../../components/Navigation/ProfileButton";
import ellipsis from "../../images/ellipsis.png";
import GetTopics from "../GetTopics";
import RelatedTopics from "../RelatedTopics";
import UserProfileInfo from "../UserProfileInfo";

import willProfile from "../../images/wbheadshot.jpg";
import magnusProfile from "../../images/magnus-profile.png";
import garryProfile from "../../images/garry.jpg";
import anandProfile from "../../images/anand.png";
import bobbyProfile from "../../images/bobby.jpg";
import kramnikProfile from "../../images/kramnik.jpg";
import karpovProfile from "../../images/karpov.jpg";
import talProfile from "../../images/tal.jpg";
import fabProfile from "../../images/fab.jpg";
import hikaruProfile from "../../images/hikaru.jpg";
import levonProfile from "../../images/levon.jpg";
import defaultProfile from "../../images/default-profile.png";

import "./styles.css"

const SearchResultsComponent = ({ searchResults, users }) => {

  const userImages = {
    1: willProfile,
    2: magnusProfile,
    3: garryProfile,
    4: anandProfile,
    5: bobbyProfile,
    6: kramnikProfile,
    7: karpovProfile,
    8: talProfile,
    9: fabProfile,
    10: hikaruProfile,
    11: levonProfile
  };

  const renderQuestionsAndAnswers = (questions, answers) => {
    return questions?.length > 0 ? (
      questions.map((question) => {
        const userId = question.user_id.toString();
        const userProfileImage = userImages[userId] || defaultProfile;
        const user = users?.find((user) => user.id === parseInt(question.user_id));

        return (
          <div key={question.id} className="question-answer-box">
            <UserProfileInfo user={user} userProfileImage={userProfileImage} />
            <NavLink to={`/questions/${question.id}`} className="question-link">
              <h5 className="title-content">{question.title}</h5>
            </NavLink>
            {answers
              .filter((answer) => answer.questionId === question.id)
              .map((answer, i) => (
                <div key={i} className="answer-item">
                  <p className="answer-content">{answer.content}</p>
                </div>
              ))}
          </div>
        );
      })
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
