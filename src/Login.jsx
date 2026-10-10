import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        {
          email: email.trim(),
          password: password
        }
      );

      const user = response.data;

      console.log("Login response:", user);

      if (!user.success) {
        alert(user.message || "Login failed.");
        return;
      }

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
      );

      if (user.role === "CANDIDATE") {
        navigate("/candidate");
      } else if (user.role === "RECRUITER") {
        navigate("/recruiter");
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        alert("Unknown user role: " + user.role);
      }

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
          "Login failed. Please check your email and password."
        );
      } else {
        alert(
          "Cannot connect to the backend. Make sure Spring Boot is running on port 8080."
        );
      }
    }
  };

  return (
    <div className="login-page">

      <div className="login-left">
        <div className="brand">
          <h1>JobPortal</h1>
          <p>Connect. Apply. Grow.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Login to continue to your account
          </p>

          <form onSubmit={handleLogin}>

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              Login
            </button>

          </form>

          <div className="login-register">

            <span>
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Create an account
            </button>

          </div>

          <p className="login-footer">
            Find your next opportunity with JobPortal
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;