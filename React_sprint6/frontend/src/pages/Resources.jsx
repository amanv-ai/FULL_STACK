import { useEffect, useState } from "react";
import API from "../services/api";
import "../css/Resources.css";

function Resources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await API.get("/resources");

      const normalized = res.data.map((r) => ({
        id: r.ResourceID,
        name: r.ResourceName,
        skill: r.Skill,
        availability: r.WorkloadShare,
      }));

      setResources(normalized);
    } catch (err) {
      alert("Access denied: Admin or Resource Manager only");
    }
  };

  const getStatus = (availability) => {
    if (availability >= 70) return { label: "High Availability", class: "status-high" };
    if (availability >= 40) return { label: "Medium Availability", class: "status-medium" };
    return { label: "Low Availability", class: "status-low" };
  };

  return (
    <div className="container">
      <h1>Resource Utilization</h1>

      {resources.length === 0 && <p className="no-resources">No resources found.</p>}

      {resources.map((r) => {
        const status = getStatus(r.availability);
        return (
          <div className="resource" key={r.id}>
            <div className="resource-info">
              <strong>
                {r.name} ({r.skill})
              </strong>
              <span>{r.availability}% WorkLoad</span>
            </div>

            <div className="resource-status">
              <div className={`status-indicator ${status.class}`}></div>
              <span>{status.label}</span>
            </div>

            <progress value={r.availability} max="100"></progress>
          </div>
        );
      })}
    </div>
  );
}

export default Resources;
