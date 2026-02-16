import { useEffect, useState } from "react";
import API from "../services/api";
import "../css/Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectManagers, setProjectManagers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    manager_id: ""
  });

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchProjects();
    if (role === "ResourceManager") {
      fetchProjectManagers();
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects");
    }
  };

  const fetchProjectManagers = async () => {
    try {
      const res = await API.get("/project-managers");
      setProjectManagers(res.data);
    } catch (err) {
      console.error("Failed to load project managers");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const createProject = async () => {
  try {
    await API.post("/projects", {
      title: formData.title,
      description: formData.description,
      manager_id: parseInt(formData.manager_id)
    });
    setFormData({
      title: "",
      description: "",
      manager_id: ""
    });
    setShowForm(false);
    fetchProjects();
    alert("Project created successfully!"); // Add success alert
  } catch (err) {
    alert("Failed to create project: " + (err.response?.data?.detail || err.message));
  }
};

  return (
    <div className="container">
      <h1><strong>Projects</strong></h1>

      {role === "ResourceManager" && (
        <button 
          className="add-project-btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Project"}
        </button>
      )}

      {showForm && role === "ResourceManager" && (
        <div className="project-form">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          <select
            name="manager_id"
            value={formData.manager_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Project Manager</option>
            {projectManagers.map(pm => (
              <option key={pm.UserID} value={pm.UserID}>
                {pm.FullName}
              </option>
            ))}
          </select>
          <button onClick={createProject}>Create Project</button>
        </div>
      )}

      <div className="projects-list">
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          projects.map((project) => (
            <div key={project.ProjectID} className="project-card">
              <h3>{project.Title}</h3>
              <p>{project.Description}</p>
              <p><strong>Start Date:</strong> {project.StartDate}</p>
              {project.EndDate && (
                <p><strong>End Date:</strong> {project.EndDate}</p>
              )}
              <p><strong>Status:</strong> {project.EndDate ? "Completed" : "Active"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Projects;