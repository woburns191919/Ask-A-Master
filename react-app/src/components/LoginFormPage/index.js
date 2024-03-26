import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import logo from "../../images/new-logo.png";
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const history = useHistory();

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const handleDemoUserLogin = () => {
    setEmail("hikaru@email.com");
    setPassword("password9");
  };


  const handleSignUpClick = () => {
    history.push("/signup");
  };

  return (
    <div className="login-container">
      <div className="outer-wrap">
        <div className="login-right">
          <img src={logo} alt="Ask a Master"></img>
        </div>
        <div className="login-left">
          <div className="login-header">Login</div>
          <form onSubmit={handleSubmit}>
            <ul className="error-list">
              {errors.map((error, idx) => (
                <li key={idx} className="error-item">
                  {error}
                </li>
              ))}
            </ul>
            <label className="form-label">
              Email
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </label>
            <div className="login-bottom">
              <button type="submit" className="form-button">
                Log In
              </button>
              <button type="button" onClick={handleDemoUserLogin}>
                Demo User
              </button>
              <button type="button" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
