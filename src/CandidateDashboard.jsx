import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CandidateDashboard.css";

function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  const [resume, setResume] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);

  const navigate = useNavigate();

  const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const candidateId = loggedInUser.id;

  const loadData = () => {
    axios
      .get("http://localhost:8080/api/jobs")
      .then((response) => setJobs(response.data))
      .catch((error) => console.error(error));

    axios
      .get("http://localhost:8080/api/applications")
      .then((response) => setApplications(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const handleResumeChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF resumes are allowed.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Resume must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setResume(selectedFile);
  };

  const uploadResume = async () => {
    if (!resume) {
      alert("Please select a PDF resume first.");
      return;
    }

    if (!candidateId) {
      alert("Candidate information not found. Please login again.");
      navigate("/");
      return;
    }

    const formData = new FormData();

    formData.append("resume", resume);

    setResumeUploading(true);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/resumes/upload/${candidateId}`,
        formData
      );

      alert(response.data);

      const updatedUser = {
        ...loggedInUser,
        resumeFileName: resume.name
      };

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(updatedUser)
      );

      setResume(null);

      const fileInput =
        document.getElementById("resume-upload");

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error) {
      console.error(error);

      const message =
        error.response?.data ||
        "Failed to upload resume.";

      alert(message);

    } finally {
      setResumeUploading(false);
    }
  };

  const applyForJob = async (jobId) => {
    if (!candidateId) {
      alert("Please login again.");
      navigate("/");
      return;
    }

    const alreadyApplied = applications.some(
      (application) =>
        application.jobId === jobId &&
        application.candidateId === candidateId
    );

    if (alreadyApplied) {
      alert("You have already applied for this job.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/applications",
        {
          jobId: jobId,
          candidateId: candidateId,
          status: "PENDING"
        }
      );

      alert("Application submitted successfully!");

      loadData();

    } catch (error) {
      console.error(error);
      alert("Failed to apply for this job.");
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const search =
      searchTerm.toLowerCase();

    return (
      job.title?.toLowerCase().includes(search) ||
      job.company?.toLowerCase().includes(search) ||
      job.location?.toLowerCase().includes(search)
    );
  });

  const candidateApplications =
    applications.filter(
      (application) =>
        application.candidateId === candidateId
    );

  const pendingApplications =
    candidateApplications.filter(
      (application) =>
        (application.status || "PENDING") === "PENDING"
    ).length;

  const acceptedApplications =
    candidateApplications.filter(
      (application) =>
        application.status === "ACCEPTED"
    ).length;

  return (
    <div className="candidate-dashboard">

      {/* SIDEBAR */}
      <aside className="candidate-sidebar">

        <div className="candidate-brand">

          <div className="candidate-brand-icon">
            J
          </div>

          <div>
            <h2>JobPortal</h2>
            <span>Candidate Portal</span>
          </div>

        </div>

        <div className="candidate-menu">

          <p className="candidate-menu-label">
            MAIN MENU
          </p>

          <button
            className={
              activeMenu === "Dashboard"
                ? "candidate-menu-item active"
                : "candidate-menu-item"
            }
            onClick={() =>
              setActiveMenu("Dashboard")
            }
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={
              activeMenu === "Find Jobs"
                ? "candidate-menu-item active"
                : "candidate-menu-item"
            }
            onClick={() =>
              setActiveMenu("Find Jobs")
            }
          >
            <span>🔎</span>
            Find Jobs
          </button>

          <button
            className={
              activeMenu === "My Applications"
                ? "candidate-menu-item active"
                : "candidate-menu-item"
            }
            onClick={() =>
              setActiveMenu("My Applications")
            }
          >
            <span>📋</span>
            My Applications
          </button>

          <button
            className={
              activeMenu === "My Profile"
                ? "candidate-menu-item active"
                : "candidate-menu-item"
            }
            onClick={() =>
              setActiveMenu("My Profile")
            }
          >
            <span>👤</span>
            My Profile
          </button>

        </div>

        <div className="candidate-sidebar-bottom">

          <div className="candidate-user">

            <div className="candidate-avatar">
              {loggedInUser.fullName
                ?.charAt(0)
                .toUpperCase() || "C"}
            </div>

            <div>
              <strong>
                {loggedInUser.fullName ||
                  "Candidate"}
              </strong>

              <span>Candidate</span>
            </div>

          </div>

          <button
            className="candidate-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="candidate-main">

        {/* TOP BAR */}
        <header className="candidate-topbar">

          <div>
            <h1>
              {activeMenu === "Dashboard" &&
                "Candidate Dashboard"}

              {activeMenu === "Find Jobs" &&
                "Find Your Next Job"}

              {activeMenu === "My Applications" &&
                "My Applications"}

              {activeMenu === "My Profile" &&
                "My Profile"}
            </h1>

            <p>
              Find opportunities and grow your career.
            </p>
          </div>

          <div className="candidate-profile-mini">

            <div className="candidate-mini-avatar">
              {loggedInUser.fullName
                ?.charAt(0)
                .toUpperCase() || "C"}
            </div>

            <div>
              <strong>
                {loggedInUser.fullName ||
                  "Candidate"}
              </strong>

              <span>
                {loggedInUser.email || ""}
              </span>
            </div>

          </div>

        </header>

        {/* DASHBOARD */}
        {activeMenu === "Dashboard" && (
          <>

            <section className="candidate-welcome">

              <div>

                <span className="candidate-welcome-tag">
                  WELCOME BACK
                </span>

                <h2>
                  Hello,{" "}
                  {loggedInUser.fullName ||
                    "Candidate"}!
                </h2>

                <p>
                  Discover your next opportunity and
                  take the next step in your career.
                </p>

                <button
                  onClick={() =>
                    setActiveMenu("Find Jobs")
                  }
                  className="candidate-primary-button"
                >
                  Find Jobs →
                </button>

              </div>

              <div className="candidate-welcome-icon">
                💼
              </div>

            </section>

            <section className="candidate-stats">

              <div className="candidate-stat-card">

                <div className="candidate-stat-icon blue">
                  💼
                </div>

                <div>
                  <span>Available Jobs</span>
                  <strong>{jobs.length}</strong>
                </div>

              </div>

              <div className="candidate-stat-card">

                <div className="candidate-stat-icon purple">
                  📋
                </div>

                <div>
                  <span>Applications</span>
                  <strong>
                    {candidateApplications.length}
                  </strong>
                </div>

              </div>

              <div className="candidate-stat-card">

                <div className="candidate-stat-icon orange">
                  ⏳
                </div>

                <div>
                  <span>Pending</span>
                  <strong>
                    {pendingApplications}
                  </strong>
                </div>

              </div>

              <div className="candidate-stat-card">

                <div className="candidate-stat-icon green">
                  ✓
                </div>

                <div>
                  <span>Accepted</span>
                  <strong>
                    {acceptedApplications}
                  </strong>
                </div>

              </div>

            </section>

            <section className="candidate-section">

              <div className="candidate-section-header">

                <div>
                  <h2>Recommended Jobs</h2>

                  <p>
                    Explore the latest opportunities.
                  </p>
                </div>

                <button
                  className="candidate-view-button"
                  onClick={() =>
                    setActiveMenu("Find Jobs")
                  }
                >
                  View All →
                </button>

              </div>

              {jobs.length === 0 ? (

                <div className="candidate-empty">
                  <div>💼</div>
                  <h3>No jobs available</h3>
                  <p>
                    New opportunities will appear here.
                  </p>
                </div>

              ) : (

                <div className="candidate-job-grid">

                  {jobs.slice(0, 4).map((job) => (

                    <div
                      className="candidate-job-card"
                      key={job.id}
                    >

                      <div className="candidate-job-top">

                        <div className="candidate-job-icon">
                          {job.company
                            ?.charAt(0)
                            .toUpperCase() || "J"}
                        </div>

                        <span className="candidate-job-badge">
                          New
                        </span>

                      </div>

                      <h3>{job.title}</h3>

                      <p>
                        🏢 {job.company}
                      </p>

                      <p>
                        📍 {job.location}
                      </p>

                      <button
                        onClick={() =>
                          applyForJob(job.id)
                        }
                        className="candidate-apply-button"
                      >
                        Apply Now
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </section>

          </>
        )}

        {/* FIND JOBS */}
        {activeMenu === "Find Jobs" && (
          <section className="candidate-section">

            <div className="candidate-search-wrapper">

              <div>
                <h2>Find Jobs</h2>

                <p>
                  Search for jobs by title, company or location.
                </p>
              </div>

              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                className="candidate-search"
              />

            </div>

            {filteredJobs.length === 0 ? (

              <div className="candidate-empty">
                <div>🔎</div>
                <h3>No jobs found</h3>
                <p>
                  Try another search term.
                </p>
              </div>

            ) : (

              <div className="candidate-job-grid">

                {filteredJobs.map((job) => (

                  <div
                    className="candidate-job-card"
                    key={job.id}
                  >

                    <div className="candidate-job-top">

                      <div className="candidate-job-icon">
                        {job.company
                          ?.charAt(0)
                          .toUpperCase() || "J"}
                      </div>

                    </div>

                    <h3>{job.title}</h3>

                    <p>
                      🏢 {job.company}
                    </p>

                    <p>
                      📍 {job.location}
                    </p>

                    <button
                      onClick={() =>
                        applyForJob(job.id)
                      }
                      className="candidate-apply-button"
                    >
                      Apply Now
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>
        )}

        {/* APPLICATIONS */}
        {activeMenu === "My Applications" && (
          <section className="candidate-section">

            <div className="candidate-section-header">

              <div>
                <h2>My Applications</h2>

                <p>
                  Track the jobs you have applied for.
                </p>
              </div>

              <button
                className="candidate-refresh-button"
                onClick={loadData}
              >
                ↻ Refresh
              </button>

            </div>

            {candidateApplications.length === 0 ? (

              <div className="candidate-empty">
                <div>📋</div>
                <h3>No applications yet</h3>
                <p>
                  Apply for a job to see it here.
                </p>
              </div>

            ) : (

              <div className="candidate-application-list">

                {candidateApplications.map(
                  (application) => {

                    const status =
                      application.status ||
                      "PENDING";

                    const job =
                      jobs.find(
                        (item) =>
                          item.id ===
                          application.jobId
                      );

                    return (
                      <div
                        className="candidate-application-card"
                        key={application.id}
                      >

                        <div className="candidate-application-icon">
                          📋
                        </div>

                        <div className="candidate-application-info">

                          <h3>
                            {job?.title ||
                              `Application #${application.id}`}
                          </h3>

                          <p>
                            {job?.company ||
                              `Job ID: ${application.jobId}`}
                          </p>

                        </div>

                        <span
                          className={`candidate-application-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </section>
        )}

        {/* PROFILE */}
        {activeMenu === "My Profile" && (
          <section className="candidate-section">

            <div className="candidate-profile-card">

              <div className="candidate-profile-header">

                <div className="candidate-profile-avatar">
                  {loggedInUser.fullName
                    ?.charAt(0)
                    .toUpperCase() || "C"}
                </div>

                <div>
                  <h2>
                    {loggedInUser.fullName ||
                      "Candidate"}
                  </h2>

                  <p>
                    {loggedInUser.email || ""}
                  </p>

                  <span className="candidate-profile-role">
                    CANDIDATE
                  </span>
                </div>

              </div>

              <div className="candidate-profile-details">

                <div>
                  <span>Full Name</span>
                  <strong>
                    {loggedInUser.fullName ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    {loggedInUser.email ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>Account Type</span>
                  <strong>Candidate</strong>
                </div>

              </div>

              {/* RESUME */}
              <div className="candidate-resume-section">

                <div className="candidate-resume-header">

                  <div>
                    <h3>My Resume</h3>

                    <p>
                      Upload your latest resume as a PDF.
                    </p>
                  </div>

                  <div className="candidate-resume-icon">
                    📄
                  </div>

                </div>

                {loggedInUser.resumeFileName ? (

                  <div className="candidate-resume-current">

                    <div className="candidate-resume-file-icon">
                      PDF
                    </div>

                    <div className="candidate-resume-file-info">

                      <strong>
                        {loggedInUser.resumeFileName}
                      </strong>

                      <span>
                        Resume uploaded
                      </span>

                    </div>

                  </div>

                ) : (

                  <div className="candidate-resume-empty">

                    <span>📄</span>

                    <div>
                      <strong>
                        No resume uploaded
                      </strong>

                      <p>
                        Upload your resume so recruiters
                        can review your profile.
                      </p>
                    </div>

                  </div>

                )}

                <div className="candidate-resume-upload">

                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeChange}
                  />

                  <button
                    type="button"
                    onClick={uploadResume}
                    disabled={
                      resumeUploading ||
                      !resume
                    }
                    className="candidate-resume-button"
                  >
                    {resumeUploading
                      ? "Uploading..."
                      : "Upload Resume"}
                  </button>

                </div>

                <small className="candidate-resume-note">
                  PDF only • Maximum size 5 MB
                </small>

              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default CandidateDashboard;