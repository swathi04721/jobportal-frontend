import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "CANDIDATE"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/users/register",
        formData
      );

      alert("Registration successful! Please login.");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-page">

      <div className="register-left">

        <div className="register-brand">
          <div className="register-logo">J</div>

          <h1>JobPortal</h1>

          <p>
            Build your career.
            <br />
            Find your opportunity.
          </p>
        </div>

        <div className="register-benefits">

          <div>
            <span>✓</span>
            Find jobs that match your skills
          </div>

          <div>
            <span>✓</span>
            Apply to jobs easily
          </div>

          <div>
            <span>✓</span>
            Connect with top recruiters
          </div>

        </div>

      </div>

      <div className="register-right">

        <div className="register-box">

          <div className="register-heading">
            <h2>Create your account</h2>

            <p>
              Join JobPortal and take the next step in your career.
            </p>
          </div>

          <form onSubmit={handleRegister}>

            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Account Type</label>

            <div className="role-options">

              <label
                className={
                  formData.role === "CANDIDATE"
                    ? "role-option selected"
                    : "role-option"
                }
              >
                <input
                  type="radio"
                  name="role"
                  value="CANDIDATE"
                  checked={formData.role === "CANDIDATE"}
                  onChange={handleChange}
                />

                <span className="role-icon">👤</span>

                <span>
                  <strong>Candidate</strong>
                  <small>Find and apply for jobs</small>
                </span>
              </label>

              <label
                className={
                  formData.role === "RECRUITER"
                    ? "role-option selected"
                    : "role-option"
                }
              >
                <input
                  type="radio"
                  name="role"
                  value="RECRUITER"
                  checked={formData.role === "RECRUITER"}
                  onChange={handleChange}
                />

                <span className="role-icon">💼</span>

                <span>
                  <strong>Recruiter</strong>
                  <small>Post jobs and hire talent</small>
                </span>
              </label>

            </div>

            <button
              type="submit"
              className="register-button"
            >
              Create Account
            </button>

          </form>

          <div className="register-login">

            <span>Already have an account?</span>

            <button
              onClick={() => navigate("/")}
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;