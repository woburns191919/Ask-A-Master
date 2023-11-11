import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import quora from "../../images/quora.png";
import answer from "../../images/answer.png";
import following from "../../images/following.png";
import home from "../../images/home.png";
import languages from "../../images/languages.png";
import notifications from "../../images/notifications.png";
import searchIcon from "../../images/searchIcon.png";
import spaces from "../../images/spaces.png";
import OpenModalButton from "../OpenModalButton";
import AddQuestionForm from "../QuestionModal/AddQuestion";
import "./Navigation.css";

function Navigation({ isLoaded, formType }) {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  if (!sessionUser) {
    return null;
  }

  return (
    <header className="navBarContainer">
      <div className="navLeft">
        <NavLink exact to="/">
          <img className="header-logo" src={quora} alt="quora-logo" />
        </NavLink>
        <img className="left-icons" src={home} alt="home-icon" />
        <img className="left-icons" src={answer} alt="answer-icon" />
        <img className="left-icons" src={following} alt="following-icon" />
        <img className="left-icons" src={spaces} alt="spaces-icon" />
        <img
          id="notifications-icon"
          className="notificaitons-icon"
          src={notifications}
          alt="notifications-icon"
        />
      </div>
      <div className="navCenter">
        <input type="search"></input>
      </div>
      <div className="navRight">
        <ProfileButton />

        <OpenModalButton
          buttonText="Ask a question"
          modalComponent={<AddQuestionForm formType={formType} />}
        />

        <button>Try Quora</button>
        <img className="languages" src={languages} alt="languages" />
      </div>
    </header>
  );
}

export default Navigation;
