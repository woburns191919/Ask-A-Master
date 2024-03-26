import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom"
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory()

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout()).then(() => {
      history.push('/login');
    });

  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="profile-button-container" id="square">
      <button onClick={openMenu}>
        {user ? (
          <span className="user-initial">{user.email[0]}</span>
        ) : (
          <i className="fas fa-user-circle" />
        )}
      </button>

      <ul className={ulClassName} ref={ulRef} id="nav-profile">
        {user && (
          <>
            <li className="username">{user.username}</li>
            <li className="email">{user.email}</li>
            <li className="bookmarks">
              <Link to={'/saved-questions'}>Bookmarks</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Log Out</button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
