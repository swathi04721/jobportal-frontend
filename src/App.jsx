import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login.jsx";
import Register from "./Register.jsx";
import CandidateDashboard from "./CandidateDashboard.jsx";
import RecruiterDashboard from "./RecruiterDashboard.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/candidate"
          element={<CandidateDashboard />}
        />

        <Route
          path="/recruiter"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;