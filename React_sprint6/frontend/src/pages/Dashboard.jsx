import { useEffect, useState } from "react";
import API from "../services/api";
import "../css/Dashboard.css";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [flippedId, setFlippedId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projectsRes = await API.get("/projects");

      // Normalize backend data
      const normalizedProjects = projectsRes.data.map((p) => ({
        id: p.ProjectID,
        title: p.Title,
        description: p.Description,
      }));

      setProjects(normalizedProjects);
    } catch (error) {
      console.error("Dashboard project load failed", error);
    }
  };

  const toggleFlip = (id) => {
    setFlippedId(flippedId === id ? null : id);
  };

  return (
    <div className="container">
      <h1>Project Overview</h1>

      <div className="grid">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`flip-card ${flippedId === p.id ? "flipped" : ""}`}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <h3>{p.title}</h3>
                <button onClick={() => toggleFlip(p.id)}>
                  View Details
                </button>
              </div>
              <div className="flip-card-back">
                <h3>{p.title}</h3>
                <p>{p.description || "No description available."}</p>
                <button onClick={() => toggleFlip(p.id)}>Back</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
