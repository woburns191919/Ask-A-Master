import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import './LoginForm.css'; // Import your new CSS file

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/questions" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Welcome Back</h1>
        <p>Login with your email and password:</p>
        <form onSubmit={handleSubmit}>
          <ul className="error-list">
            {errors.map((error, idx) => (
              <li key={idx} className="error-item">{error}</li>
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
          <button type="submit" className="form-button">Log In</button>
        </form>
      </div>
      <div className="login-right">
        <h2>Or continue with</h2>
        <button className="continue-google">Continue with Google</button>
        <button className="continue-facebook">Continue with Facebook</button>
      </div>
    </div>
  );
}

export default LoginFormPage;
