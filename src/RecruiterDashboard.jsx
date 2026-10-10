import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddJob from "./AddJob";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const navigate = useNavigate();

  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const loadJobs = async () => {
    if (!loggedInUser || !loggedInUser.id) {
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/api/jobs/recruiter/${loggedInUser.id}`
      );

      setJobs(response.data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/applications"
      );

      setApplications(response.data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/users"
      );

      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!loggedInUser || !loggedInUser.id) {
        return;
      }

      try {
        const [
          jobsResponse,
          applicationsResponse,
          usersResponse
        ] = await Promise.all([
          axios.get(
            `http://localhost:8080/api/jobs/recruiter/${loggedInUser.id}`
          ),
          axios.get(
            "http://localhost:8080/api/applications"
          ),
          axios.get(
            "http://localhost:8080/api/users"
          )
        ]);

        setJobs(jobsResponse.data);
        setApplications(applicationsResponse.data);
        setUsers(usersResponse.data);

        console.log(
          "Recruiter dashboard loaded successfully."
        );
      } catch (error) {
        console.error(
          "Failed to load recruiter dashboard:",
          error
        );
      }
    };

    loadDashboardData();
  }, []);

  const getCandidate = (candidateId) => {
    return users.find(
      (user) => user.id === candidateId
    );
  };

  const viewResume = (candidateId) => {
    const candidate = getCandidate(candidateId);

    if (!candidate) {
      alert("Candidate information not found.");
      return;
    }

    if (!candidate.resumeFileName) {
      alert("This candidate has not uploaded a resume.");
      return;
    }

    window.open(
      `http://localhost:8080/api/resumes/${candidateId}`,
      "_blank"
    );
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/applications/${id}/status?status=${status}`
      );

      alert(
        `Application ${status.toLowerCase()} successfully!`
      );

      await loadApplications();
    } catch (error) {
      console.error(error);
      alert("Failed to update application.");
    }
  };

  const deleteJob = async (id) => {
    if (!loggedInUser || !loggedInUser.id) {
      alert(
        "Recruiter information not found. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/jobs/${id}?recruiterId=${loggedInUser.id}`
      );

      alert("Job deleted successfully!");

      await loadJobs();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to delete job."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const pendingApplications = applications.filter(
    (application) =>
      !application.status ||
      application.status === "PENDING"
  ).length;

  const acceptedApplications = applications.filter(
    (application) =>
      application.status === "ACCEPTED"
  ).length;

  return (
    <div className="recruiter-dashboard">

      {/* SIDEBAR */}

      <aside className="recruiter-sidebar">

        <div className="recruiter-brand">
          <div className="recruiter-brand-icon">
            J
          </div>

          <div>
            <h2>JobPortal</h2>
            <span>Recruiter Platform</span>
          </div>
        </div>

        <div className="recruiter-menu">

          <p className="recruiter-menu-label">
            MAIN MENU
          </p>

          <button
            className={
              activeMenu === "Dashboard"
                ? "recruiter-menu-item active"
                : "recruiter-menu-item"
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
              activeMenu === "Add Job"
                ? "recruiter-menu-item active"
                : "recruiter-menu-item"
            }
            onClick={() =>
              setActiveMenu("Add Job")
            }
          >
            <span>＋</span>
            Add Job
          </button>

          <button
            className={
              activeMenu === "My Jobs"
                ? "recruiter-menu-item active"
                : "recruiter-menu-item"
            }
            onClick={() =>
              setActiveMenu("My Jobs")
            }
          >
            <span>💼</span>
            My Jobs
          </button>

          <button
            className={
              activeMenu === "Applications"
                ? "recruiter-menu-item active"
                : "recruiter-menu-item"
            }
            onClick={() =>
              setActiveMenu("Applications")
            }
          >
            <span>📋</span>
            Applications
          </button>

          <p className="recruiter-menu-label account-label">
            ACCOUNT
          </p>

          <button
            className={
              activeMenu === "Profile"
                ? "recruiter-menu-item active"
                : "recruiter-menu-item"
            }
            onClick={() =>
              setActiveMenu("Profile")
            }
          >
            <span>👤</span>
            Profile
          </button>

        </div>

        <div className="recruiter-sidebar-bottom">

          <div className="recruiter-user">

            <div className="recruiter-avatar">
              R
            </div>

            <div>
              <strong>
                {loggedInUser?.fullName || "Recruiter"}
              </strong>

              <span>
                Employer Account
              </span>
            </div>

          </div>

          <button
            className="recruiter-logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="recruiter-main">

        {/* TOP BAR */}

        <header className="recruiter-topbar">

          <div>

            <h1>
              {activeMenu === "Dashboard" &&
                "Recruiter Dashboard"}

              {activeMenu === "Add Job" &&
                "Post a New Job"}

              {activeMenu === "My Jobs" &&
                "My Jobs"}

              {activeMenu === "Applications" &&
                "Applications"}

              {activeMenu === "Profile" &&
                "Recruiter Profile"}
            </h1>

            <p>
              Manage your jobs and find the right
              candidates.
            </p>

          </div>

          <div className="recruiter-top-actions">

            <button
              className="recruiter-notification"
              title="Notifications"
            >
              🔔
              <span></span>
            </button>

            <div className="recruiter-profile-mini">

              <div className="recruiter-mini-avatar">
                R
              </div>

              <div>

                <strong>
                  {loggedInUser?.fullName || "Recruiter"}
                </strong>

                <span>
                  Employer
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* DASHBOARD */}

        {activeMenu === "Dashboard" && (
          <>

            <section className="recruiter-welcome">

              <div>

                <span className="recruiter-welcome-tag">
                  RECRUITER CENTER
                </span>

                <h2>
                  Build your team with great talent.
                </h2>

                <p>
                  Post opportunities, review applications,
                  and connect with qualified candidates.
                </p>

                <button
                  className="post-job-button"
                  onClick={() =>
                    setActiveMenu("Add Job")
                  }
                >
                  + Post a Job
                </button>

              </div>

              <div className="recruiter-welcome-icon">
                👥
              </div>

            </section>

            <section className="recruiter-stats">

              <div className="recruiter-stat-card">

                <div className="recruiter-stat-icon blue">
                  💼
                </div>

                <div>
                  <span>Total Jobs</span>
                  <strong>{jobs.length}</strong>
                </div>

              </div>

              <div className="recruiter-stat-card">

                <div className="recruiter-stat-icon purple">
                  📋
                </div>

                <div>
                  <span>Applications</span>
                  <strong>
                    {applications.length}
                  </strong>
                </div>

              </div>

              <div className="recruiter-stat-card">

                <div className="recruiter-stat-icon orange">
                  ⏳
                </div>

                <div>
                  <span>Pending</span>
                  <strong>
                    {pendingApplications}
                  </strong>
                </div>

              </div>

              <div className="recruiter-stat-card">

                <div className="recruiter-stat-icon green">
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

            {/* RECENT JOBS */}

            <section className="recruiter-section">

              <div className="recruiter-section-header">

                <div>

                  <h2>
                    Recent Job Posts
                  </h2>

                  <p>
                    Manage your latest job opportunities.
                  </p>

                </div>

                <button
                  className="recruiter-view-button"
                  onClick={() =>
                    setActiveMenu("My Jobs")
                  }
                >
                  View All →
                </button>

              </div>

              {jobs.length === 0 ? (

                <div className="recruiter-empty">

                  <div>💼</div>

                  <h3>
                    No jobs posted yet
                  </h3>

                  <p>
                    Create your first job posting to
                    attract candidates.
                  </p>

                  <button
                    onClick={() =>
                      setActiveMenu("Add Job")
                    }
                  >
                    + Post Job
                  </button>

                </div>

              ) : (

                <div className="recruiter-job-grid">

                  {jobs.slice(0, 4).map((job) => (

                    <div
                      className="recruiter-job-card"
                      key={job.id}
                    >

                      <div className="recruiter-job-top">

                        <div className="recruiter-company-icon">
                          {job.company
                            ?.charAt(0)
                            .toUpperCase() || "C"}
                        </div>

                        <span>
                          Active
                        </span>

                      </div>

                      <h3>
                        {job.title}
                      </h3>

                      <p>
                        🏢 {job.company}
                      </p>

                      <p>
                        📍 {job.location}
                      </p>

                      <div className="recruiter-job-footer">

                        <span>
                          Job ID: {job.id}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </section>

            {/* RECENT APPLICATIONS */}

            <section className="recruiter-section">

              <div className="recruiter-section-header">

                <div>

                  <h2>
                    Recent Applications
                  </h2>

                  <p>
                    Review candidate applications.
                  </p>

                </div>

                <button
                  className="recruiter-view-button"
                  onClick={() =>
                    setActiveMenu("Applications")
                  }
                >
                  View All →
                </button>

              </div>

              {applications.length === 0 ? (

                <div className="recruiter-empty small">

                  <div>📋</div>

                  <h3>
                    No applications yet
                  </h3>

                  <p>
                    Candidate applications will appear
                    here.
                  </p>

                </div>

              ) : (

                <div className="recruiter-application-list">

                  {applications
                    .slice(0, 5)
                    .map((application) => {

                      const status =
                        application.status ||
                        "PENDING";

                      const candidate =
                        getCandidate(
                          application.candidateId
                        );

                      return (

                        <div
                          className="recruiter-application"
                          key={application.id}
                        >

                          <div className="candidate-avatar">
                            C
                          </div>

                          <div className="application-info">

                            <h3>
                              {candidate?.fullName ||
                                `Candidate #${application.candidateId}`}
                            </h3>

                            <p>
                              {candidate?.email ||
                                `Applied for Job #${application.jobId}`}
                            </p>

                          </div>

                          <span
                            className={`recruiter-status ${status.toLowerCase()}`}
                          >
                            {status}
                          </span>

                        </div>

                      );

                    })}

                </div>

              )}

            </section>

          </>
        )}

        {/* ADD JOB */}

        {activeMenu === "Add Job" && (

          <section className="recruiter-section add-job-section">

            <div className="recruiter-section-header">

              <div>

                <h2>
                  Create Job Posting
                </h2>

                <p>
                  Add a new opportunity to JobPortal.
                </p>

              </div>

            </div>

            <AddJob />

          </section>

        )}

        {/* MY JOBS */}

        {activeMenu === "My Jobs" && (

          <section className="recruiter-section">

            <div className="recruiter-section-header">

              <div>

                <h2>
                  My Jobs
                </h2>

                <p>
                  Manage all your posted opportunities.
                </p>

              </div>

              <button
                className="recruiter-refresh"
                onClick={loadJobs}
              >
                ↻ Refresh
              </button>

            </div>

            {jobs.length === 0 ? (

              <div className="recruiter-empty">

                <div>💼</div>

                <h3>
                  No jobs available
                </h3>

                <p>
                  Start by posting your first job.
                </p>

              </div>

            ) : (

              <div className="recruiter-job-grid">

                {jobs.map((job) => (

                  <div
                    className="recruiter-job-card"
                    key={job.id}
                  >

                    <div className="recruiter-job-top">

                      <div className="recruiter-company-icon">
                        {job.company
                          ?.charAt(0)
                          .toUpperCase() || "C"}
                      </div>

                      <span>
                        Active
                      </span>

                    </div>

                    <h3>
                      {job.title}
                    </h3>

                    <p>
                      🏢 {job.company}
                    </p>

                    <p>
                      📍 {job.location}
                    </p>

                    <p className="job-description">
                      {job.description}
                    </p>

                    <div className="recruiter-job-footer">

                      <span>
                        Job ID: {job.id}
                      </span>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteJob(job.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

        )}

        {/* APPLICATIONS */}

        {activeMenu === "Applications" && (

          <section className="recruiter-section">

            <div className="recruiter-section-header">

              <div>

                <h2>
                  Candidate Applications
                </h2>

                <p>
                  Review and manage submitted applications.
                </p>

              </div>

              <button
                className="recruiter-refresh"
                onClick={() => {
                  loadApplications();
                  loadUsers();
                }}
              >
                ↻ Refresh
              </button>

            </div>

            {applications.length === 0 ? (

              <div className="recruiter-empty">

                <div>📋</div>

                <h3>
                  No applications found
                </h3>

                <p>
                  Applications will appear here when
                  candidates apply.
                </p>

              </div>

            ) : (

              <div className="full-application-list">

                {applications.map((application) => {

                  const status =
                    application.status ||
                    "PENDING";

                  const candidate =
                    getCandidate(
                      application.candidateId
                    );

                  return (

                    <div
                      className="full-application-card"
                      key={application.id}
                    >

                      <div className="candidate-avatar large">
                        C
                      </div>

                      <div className="full-application-info">

                        <h3>
                          {candidate?.fullName ||
                            `Candidate #${application.candidateId}`}
                        </h3>

                        <p>
                          Email:{" "}
                          {candidate?.email ||
                            "Not available"}
                        </p>

                        <p>
                          Application ID:{" "}
                          {application.id}
                        </p>

                        <p>
                          Job ID:{" "}
                          {application.jobId}
                        </p>

                        <div className="resume-status">

                          {candidate?.resumeFileName ? (

                            <span className="resume-available">
                              ✓ Resume Available
                            </span>

                          ) : (

                            <span className="resume-missing">
                              No Resume Uploaded
                            </span>

                          )}

                        </div>

                      </div>

                      <div className="application-actions">

                        <button
                          className="resume-button"
                          disabled={
                            !candidate?.resumeFileName
                          }
                          onClick={() =>
                            viewResume(
                              application.candidateId
                            )
                          }
                        >
                          View Resume
                        </button>

                        <span
                          className={`recruiter-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>

                        <button
                          className="accept-button"
                          disabled={
                            status === "ACCEPTED"
                          }
                          onClick={() =>
                            updateApplicationStatus(
                              application.id,
                              "ACCEPTED"
                            )
                          }
                        >
                          ✓ Accept
                        </button>

                        <button
                          className="reject-button"
                          disabled={
                            status === "REJECTED"
                          }
                          onClick={() =>
                            updateApplicationStatus(
                              application.id,
                              "REJECTED"
                            )
                          }
                        >
                          ✕ Reject
                        </button>

                      </div>

                    </div>

                  );

                })}

              </div>

            )}

          </section>

        )}

        {/* PROFILE */}

        {activeMenu === "Profile" && (

          <section className="recruiter-section">

            <div className="recruiter-section-header">

              <div>

                <h2>
                  Recruiter Profile
                </h2>

                <p>
                  Manage your employer account information.
                </p>

              </div>

            </div>

            <div className="recruiter-profile-card">

              <div className="large-recruiter-avatar">
                R
              </div>

              <h2>
                {loggedInUser?.fullName || "Recruiter"}
              </h2>

              <div className="recruiter-profile-grid">

                <div>
                  <span>
                    Account Type
                  </span>

                  <strong>
                    Recruiter
                  </strong>
                </div>

                <div>
                  <span>
                    Account Status
                  </span>

                  <strong className="active-text">
                    Active
                  </strong>
                </div>

                <div>
                  <span>
                    Jobs Posted
                  </span>

                  <strong>
                    {jobs.length}
                  </strong>
                </div>

                <div>
                  <span>
                    Applications Received
                  </span>

                  <strong>
                    {applications.length}
                  </strong>
                </div>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default RecruiterDashboard;