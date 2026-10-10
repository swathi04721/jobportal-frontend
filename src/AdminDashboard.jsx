import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const navigate = useNavigate();

  const loadData = () => {
    axios
      .get("http://localhost:8080/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(error));

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

  const logout = () => {
    navigate("/");
  };

  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;

    axios
      .delete(`http://localhost:8080/api/users/${id}`)
      .then(() => {
        alert("User deleted successfully!");
        loadData();
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to delete user.");
      });
  };

  const deleteJob = (id) => {
    if (!window.confirm("Delete this job?")) return;

    axios
      .delete(`http://localhost:8080/api/jobs/${id}`)
      .then(() => {
        alert("Job deleted successfully!");
        loadData();
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to delete job.");
      });
  };

  const deleteApplication = (id) => {
    if (!window.confirm("Delete this application?")) return;

    axios
      .delete(`http://localhost:8080/api/applications/${id}`)
      .then(() => {
        alert("Application deleted successfully!");
        loadData();
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to delete application.");
      });
  };

  const candidates = users.filter(
    (user) => user.role === "CANDIDATE"
  ).length;

  const recruiters = users.filter(
    (user) => user.role === "RECRUITER"
  ).length;

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-brand">
          <div className="admin-brand-icon">
            J
          </div>

          <div>
            <h2>JobPortal</h2>
            <span>Administration</span>
          </div>
        </div>

        <div className="admin-menu">

          <p className="admin-menu-label">
            MAIN MENU
          </p>

          <button
            className={
              activeMenu === "Dashboard"
                ? "admin-menu-item active"
                : "admin-menu-item"
            }
            onClick={() => setActiveMenu("Dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={
              activeMenu === "Users"
                ? "admin-menu-item active"
                : "admin-menu-item"
            }
            onClick={() => setActiveMenu("Users")}
          >
            <span>👥</span>
            Users
          </button>

          <button
            className={
              activeMenu === "Jobs"
                ? "admin-menu-item active"
                : "admin-menu-item"
            }
            onClick={() => setActiveMenu("Jobs")}
          >
            <span>💼</span>
            Jobs
          </button>

          <button
            className={
              activeMenu === "Applications"
                ? "admin-menu-item active"
                : "admin-menu-item"
            }
            onClick={() => setActiveMenu("Applications")}
          >
            <span>📋</span>
            Applications
          </button>

          <p className="admin-menu-label account-label">
            SYSTEM
          </p>

          <button
            className={
              activeMenu === "Overview"
                ? "admin-menu-item active"
                : "admin-menu-item"
            }
            onClick={() => setActiveMenu("Overview")}
          >
            <span>📊</span>
            Overview
          </button>

        </div>

        <div className="admin-sidebar-bottom">

          <div className="admin-user">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>

          </div>

          <button
            className="admin-logout"
            onClick={logout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="admin-main">

        {/* TOP BAR */}
        <header className="admin-topbar">

          <div>
            <h1>
              {activeMenu === "Dashboard" &&
                "Admin Dashboard"}

              {activeMenu === "Users" &&
                "User Management"}

              {activeMenu === "Jobs" &&
                "Job Management"}

              {activeMenu === "Applications" &&
                "Application Management"}

              {activeMenu === "Overview" &&
                "System Overview"}
            </h1>

            <p>
              Monitor and manage your JobPortal platform.
            </p>
          </div>

          <div className="admin-top-actions">

            <button
              className="admin-notification"
              title="Notifications"
            >
              🔔
              <span></span>
            </button>

            <div className="admin-profile-mini">

              <div className="admin-mini-avatar">
                A
              </div>

              <div>
                <strong>Administrator</strong>
                <span>System Admin</span>
              </div>

            </div>

          </div>

        </header>

        {/* DASHBOARD */}
        {activeMenu === "Dashboard" && (
          <>

            <section className="admin-welcome">

              <div>

                <span className="admin-welcome-tag">
                  SYSTEM ADMINISTRATION
                </span>

                <h2>
                  Welcome to your control center.
                </h2>

                <p>
                  Manage users, jobs and applications
                  across the entire JobPortal platform.
                </p>

                <button
                  onClick={loadData}
                  className="admin-refresh-primary"
                >
                  ↻ Refresh Data
                </button>

              </div>

              <div className="admin-welcome-icon">
                ⚙️
              </div>

            </section>

            {/* STATS */}
            <section className="admin-stats">

              <div className="admin-stat-card">

                <div className="admin-stat-icon blue">
                  👥
                </div>

                <div>
                  <span>Total Users</span>
                  <strong>{users.length}</strong>
                </div>

              </div>

              <div className="admin-stat-card">

                <div className="admin-stat-icon purple">
                  💼
                </div>

                <div>
                  <span>Total Jobs</span>
                  <strong>{jobs.length}</strong>
                </div>

              </div>

              <div className="admin-stat-card">

                <div className="admin-stat-icon orange">
                  📋
                </div>

                <div>
                  <span>Applications</span>
                  <strong>
                    {applications.length}
                  </strong>
                </div>

              </div>

              <div className="admin-stat-card">

                <div className="admin-stat-icon green">
                  ✓
                </div>

                <div>
                  <span>Active Users</span>
                  <strong>{users.length}</strong>
                </div>

              </div>

            </section>

            {/* USER OVERVIEW */}
            <section className="admin-section">

              <div className="admin-section-header">

                <div>
                  <h2>User Overview</h2>

                  <p>
                    Current users registered on the platform.
                  </p>
                </div>

                <button
                  className="admin-view-button"
                  onClick={() =>
                    setActiveMenu("Users")
                  }
                >
                  View Users →
                </button>

              </div>

              <div className="admin-overview-grid">

                <div className="admin-overview-card">

                  <div className="overview-icon candidate">
                    👤
                  </div>

                  <div>
                    <span>Candidates</span>
                    <strong>{candidates}</strong>
                  </div>

                </div>

                <div className="admin-overview-card">

                  <div className="overview-icon recruiter">
                    💼
                  </div>

                  <div>
                    <span>Recruiters</span>
                    <strong>{recruiters}</strong>
                  </div>

                </div>

                <div className="admin-overview-card">

                  <div className="overview-icon admin">
                    🛡️
                  </div>

                  <div>
                    <span>Administrators</span>
                    <strong>
                      {users.length -
                        candidates -
                        recruiters}
                    </strong>
                  </div>

                </div>

              </div>

            </section>

            {/* RECENT JOBS */}
            <section className="admin-section">

              <div className="admin-section-header">

                <div>
                  <h2>Recent Jobs</h2>

                  <p>
                    Latest jobs available on the platform.
                  </p>
                </div>

                <button
                  className="admin-view-button"
                  onClick={() => setActiveMenu("Jobs")}
                >
                  View Jobs →
                </button>

              </div>

              {jobs.length === 0 ? (

                <div className="admin-empty">
                  <div>💼</div>
                  <h3>No jobs available</h3>
                  <p>
                    Jobs posted by recruiters will appear here.
                  </p>
                </div>

              ) : (

                <div className="admin-job-grid">

                  {jobs.slice(0, 4).map((job) => (

                    <div
                      className="admin-job-card"
                      key={job.id}
                    >

                      <div className="admin-job-icon">
                        {job.company
                          ?.charAt(0)
                          .toUpperCase() || "J"}
                      </div>

                      <div className="admin-job-info">

                        <h3>{job.title}</h3>

                        <p>
                          🏢 {job.company}
                        </p>

                        <p>
                          📍 {job.location}
                        </p>

                      </div>

                      <span className="admin-active-badge">
                        Active
                      </span>

                    </div>

                  ))}

                </div>

              )}

            </section>

          </>
        )}

        {/* USERS */}
        {activeMenu === "Users" && (
          <section className="admin-section">

            <div className="admin-section-header">

              <div>
                <h2>Registered Users</h2>

                <p>
                  Manage candidates, recruiters and administrators.
                </p>
              </div>

              <button
                className="admin-refresh"
                onClick={loadData}
              >
                ↻ Refresh
              </button>

            </div>

            {users.length === 0 ? (

              <div className="admin-empty">
                <div>👥</div>
                <h3>No users found</h3>
              </div>

            ) : (

              <div className="admin-user-list">

                {users.map((user) => (

                  <div
                    className="admin-user-card"
                    key={user.id}
                  >

                    <div className="admin-user-avatar">
                      {user.fullName
                        ?.charAt(0)
                        .toUpperCase() || "U"}
                    </div>

                    <div className="admin-user-info">

                      <h3>
                        {user.fullName}
                      </h3>

                      <p>
                        {user.email}
                      </p>

                      <small>
                        User ID: {user.id}
                      </small>

                    </div>

                    <span
                      className={`admin-role-badge ${user.role?.toLowerCase()}`}
                    >
                      {user.role}
                    </span>

                    <button
                      className="admin-delete-button"
                      onClick={() =>
                        deleteUser(user.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>
        )}

        {/* JOBS */}
        {activeMenu === "Jobs" && (
          <section className="admin-section">

            <div className="admin-section-header">

              <div>
                <h2>Job Management</h2>

                <p>
                  Monitor all jobs posted by recruiters.
                </p>
              </div>

              <button
                className="admin-refresh"
                onClick={loadData}
              >
                ↻ Refresh
              </button>

            </div>

            {jobs.length === 0 ? (

              <div className="admin-empty">
                <div>💼</div>
                <h3>No jobs found</h3>
              </div>

            ) : (

              <div className="admin-job-list">

                {jobs.map((job) => (

                  <div
                    className="admin-management-job"
                    key={job.id}
                  >

                    <div className="admin-job-icon">
                      {job.company
                        ?.charAt(0)
                        .toUpperCase() || "J"}
                    </div>

                    <div className="admin-management-info">

                      <h3>{job.title}</h3>

                      <p>
                        🏢 {job.company}
                      </p>

                      <p>
                        📍 {job.location}
                      </p>

                      <small>
                        Job ID: {job.id}
                      </small>

                    </div>

                    <span className="admin-active-badge">
                      Active
                    </span>

                    <button
                      className="admin-delete-button"
                      onClick={() =>
                        deleteJob(job.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                ))}

              </div>

            )}

          </section>
        )}

        {/* APPLICATIONS */}
        {activeMenu === "Applications" && (
          <section className="admin-section">

            <div className="admin-section-header">

              <div>
                <h2>Application Management</h2>

                <p>
                  Monitor all candidate applications.
                </p>
              </div>

              <button
                className="admin-refresh"
                onClick={loadData}
              >
                ↻ Refresh
              </button>

            </div>

            {applications.length === 0 ? (

              <div className="admin-empty">
                <div>📋</div>
                <h3>No applications found</h3>
              </div>

            ) : (

              <div className="admin-application-list">

                {applications.map((application) => {

                  const status =
                    application.status ||
                    "PENDING";

                  return (
                    <div
                      className="admin-application-card"
                      key={application.id}
                    >

                      <div className="admin-application-icon">
                        📋
                      </div>

                      <div className="admin-application-info">

                        <h3>
                          Application #
                          {application.id}
                        </h3>

                        <p>
                          Job ID:{" "}
                          {application.jobId}
                        </p>

                        <p>
                          Candidate ID:{" "}
                          {application.candidateId}
                        </p>

                      </div>

                      <span
                        className={`admin-application-status ${status.toLowerCase()}`}
                      >
                        {status}
                      </span>

                      <button
                        className="admin-delete-button"
                        onClick={() =>
                          deleteApplication(
                            application.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>
                  );
                })}

              </div>

            )}

          </section>
        )}

        {/* OVERVIEW */}
        {activeMenu === "Overview" && (
          <section className="admin-section">

            <div className="admin-section-header">

              <div>
                <h2>System Overview</h2>

                <p>
                  A summary of your JobPortal platform.
                </p>
              </div>

            </div>

            <div className="admin-overview-large">

              <div>
                <span>Total Users</span>
                <strong>{users.length}</strong>
              </div>

              <div>
                <span>Candidates</span>
                <strong>{candidates}</strong>
              </div>

              <div>
                <span>Recruiters</span>
                <strong>{recruiters}</strong>
              </div>

              <div>
                <span>Total Jobs</span>
                <strong>{jobs.length}</strong>
              </div>

              <div>
                <span>Applications</span>
                <strong>
                  {applications.length}
                </strong>
              </div>

            </div>

          </section>
        )}

      </main>
    </div>
  );
}

export default AdminDashboard;