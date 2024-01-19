import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import quora from "../../images/quora.png";
import home from "../../images/home.png";
import answer from "../../images/answer.png";
import following from "../../images/following.png";
import spaces from "../../images/spaces.png";
import notifications from "../../images/notifications.png";
import searchIcon from "../../images/searchIcon.png";
import languages from "../../images/languages.png";
import icon from "../../images/my-logo.png";
import OpenModalButton from "../OpenModalButton";
import AddQuestionForm from "../QuestionModal/AddQuestion";
import { useHistory } from "react-router-dom";
import SearchResultsComponent from "../SearchResults";

function Navigation({ onAddQuestion, user, updateSearchResults }) {
  const [searchTerm, setSearchTerm] = useState("");

  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  function TooltipIcon({ src, alt, tooltipText }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ position: "relative" }}
      >
        <img className="navIcon" src={src} alt={alt} />
        {showTooltip && <div className="tooltip">{tooltipText}</div>}
      </div>
    );
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const performSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchTerm)}`
      );
      if (response.ok) {
        const data = await response.json();
        updateSearchResults(data);
        history.push("/search-results");
        setSearchTerm("");
      } else {
        console.error("Search failed");
      }
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  if (!sessionUser) {
    return null;
  }

  return (
    <header className="navBarContainer">
      <div className="navItems">
        <NavLink exact to="/">
          <TooltipIcon src={home} alt="home" tooltipText="Home" />
        </NavLink>

        <div className="searchBar">
          <input
            type="search"
            placeholder="Search Ask a Master"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
          />
          <div className="searchIconWrapper" onClick={performSearch}>
            <img src={searchIcon} alt="Search" />
          </div>
        </div>

<div className="profile-and-question">
        {user && <ProfileButton user={user} />}

        <div className="red-question">
          <OpenModalButton
            buttonText="Add Question"
            modalComponent={
              <AddQuestionForm
                formType="Create"
                onQuestionAdded={onAddQuestion}
                className="open-modal-button"
              />
            }
          />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
