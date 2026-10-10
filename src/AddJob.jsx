import { useState } from "react";
import axios from "axios";

function AddJob() {
  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser")
  );

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    description: ""
  });

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUser || !loggedInUser.id) {
      alert("Recruiter information not found. Please login again.");
      return;
    }

    try {
      const jobData = {
        ...job,
        recruiterId: loggedInUser.id
      };

      await axios.post(
        "http://localhost:8080/api/jobs",
        jobData
      );

      alert("Job added successfully!");

      setJob({
        title: "",
        company: "",
        location: "",
        description: ""
      });

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to add job!"
      );
    }
  };

  return (
    <div>
      <h1>Add Job</h1>

      <form onSubmit={handleSubmit}>

        <input
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          name="company"
          placeholder="Company"
          value={job.company}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <button type="submit">
          Add Job
        </button>

      </form>
    </div>
  );
}

export default AddJob;