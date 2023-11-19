import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css"; // Updated CSS file
import quora from "../../images/quora.png";
import home from "../../images/home.png";
import answer from "../../images/answer.png";
import following from "../../images/following.png";
import spaces from "../../images/spaces.png";
import notifications from "../../images/notifications.png";
import searchIcon from "../../images/searchIcon.png";
import languages from "../../images/languages.png";
import OpenModalButton from "../OpenModalButton";
import AddQuestionForm from "../QuestionModal/AddQuestion";

function Navigation({ onAddQuestion, user }) {
    const sessionUser = useSelector((state) => state.session.user);

    if (!sessionUser) {
        return null;
    }

    return (
      <header className="navBarContainer">
        <div className="navLogo">
          <NavLink exact to="/">
            <img className="header-logo" src={quora} alt="quora-logo" />
          </NavLink>
        </div>
        <div className="navItems">
          <img className="navIcon" src={home} alt="home" />
          <img className="navIcon" src={following} alt="following" />
          <img className="navIcon" src={answer} alt="answer" />
          <img className="navIcon" src={spaces} alt="spaces" />
          <img className="navIcon" src={notifications} alt="notifications" />
          <div className="searchBar">
            <input type="search" placeholder="Search Quora" />
          </div>
            <button className="tryQuoraButton">Try Quora+</button>
          <div className="navActions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
            {user && <ProfileButton user={user} style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0073e6', color: 'white', border: 'none' }}/>}
            <img className="languagesIcon" src={languages} alt="languages" />
            <OpenModalButton
            
              buttonText="Add Question"
              modalComponent={<AddQuestionForm formType="Create" onQuestionAdded={onAddQuestion}
              style={{ backgroundColor: '#b92b27', color: 'white', border: 'none', borderRadius: '20px', padding: '8px 15px', cursor: 'pointer' }}/>}
            />
          </div>
        </div>
      </header>
    );
  }

export default Navigation;
