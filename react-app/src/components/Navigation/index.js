import React, { useState } from "react";
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
    if (!searchTerm.trim()) return; // Prevent searching with empty string

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchTerm)}`
      );
      if (response.ok) {
        const data = await response.json();
        updateSearchResults(data);
        history.push("/search-results");
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
      <div className="navLogo">
        <NavLink exact to="/">
          <img className="header-logo" src={icon} alt="ask-a-master-logo" />
        </NavLink>
      </div>
      <div className="navItems">
        <NavLink exact to="/">
          <TooltipIcon src={home} alt="home" tooltipText="Home" />
        </NavLink>
        <TooltipIcon src={following} alt="following" tooltipText="Following" />
        <TooltipIcon src={answer} alt="answer" tooltipText="Answer" />
        <TooltipIcon src={spaces} alt="spaces" tooltipText="Spaces" />
        <TooltipIcon
          src={notifications}
          alt="notifications"
          tooltipText="Notifications"
        />
        <div className="searchBar">
          <input
            type="search"
            placeholder="Search Quora"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
          />
        </div>
        <button className="tryQuoraButton">Try Ask a Master+</button>
        <div
          className="navActions"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {user && <ProfileButton user={user} />}
          <TooltipIcon src={languages} alt="languages" tooltipText="languages" />
      
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
