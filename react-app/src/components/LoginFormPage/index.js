import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import logo from "../../images/quora.png";
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

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

  return (
    <div className="login-container">
      <div className="outer-wrap">
        <div className="login-right">
          <img src={logo}></img>
          <p>
            A place to share knowledge and better understand the world of chess
          </p>
          {/* switched */}
          <div className="google-face">
            <button className="continue-google">Continue with Google</button>
            <button className="continue-facebook">
              Continue with Facebook
            </button>
          </div>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;
