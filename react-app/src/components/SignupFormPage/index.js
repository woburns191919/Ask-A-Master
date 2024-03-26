import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";

function SignupFormPage() {
  console.log('signup form page mounting')
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);


  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data);
      }
    } else {
      setErrors([
        "Confirm Password field must be the same as the Password field",
      ]);
    }
  };

  const style = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "400px",
      margin: "50px auto",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
    },
    label: {
      display: "flex",
      gap: "5%",
      alignItems: "center",
      marginBottom: "10px",
    },
    title: {
      fontSize: "24px",
      color: "#333",
      marginBottom: "20px",
      textAlign: "center",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    input: {
      padding: "10px",
      marginBottom: "15px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "14px",
    },
    button: {
      backgroundColor: "#2e69ff",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
    },
    errorList: {
      color: "red",
      listStyleType: "none",
      padding: 0,
    },
    errorItem: {
      marginBottom: "10px",
    },
  };


  return (
    <>
      <div style={style.container}>
        <h1 style={style.title}>Sign Up</h1>
        <form onSubmit={handleSubmit} style={style.form}>
          <ul style={style.errorList}>
            {errors.map((error, idx) => (
              <li key={idx} style={style.errorItem}>
                {error}
              </li>
            ))}
          </ul>
          <label style={style.label}>
            Email
            <input
              autoComplete="off"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={style.input}
            />
          </label>
          <label style={style.label}>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={style.input}
            />
          </label>
          <label style={style.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={style.input}
            />
          </label>
          <label style={style.label}>
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={style.input}
            />
          </label>
          <button type="submit" style={style.button}>
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}

export default SignupFormPage;
