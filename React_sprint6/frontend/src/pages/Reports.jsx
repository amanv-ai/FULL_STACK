import { useEffect, useState } from "react";
import API from "../services/api";
import "../css/Projects.css";
import jsPDF from "jspdf";

function Reports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await API.get("/dashboard");
      setReport(res.data);
    } catch (err) {
      console.error("Failed to load report");
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const doc = new jsPDF();
    doc.text("Project Reports", 20, 20);
    doc.text(`Total Projects: ${report.projects}`, 20, 40);
    doc.text(`Total Tasks: ${report.tasks}`, 20, 50);
    doc.text(`Completed Tasks: ${report.completed}`, 20, 60);
    doc.text(`In-Progress Tasks: ${report.in_progress}`, 20, 70);
    doc.text(`Total Resources: ${report.resources}`, 20, 80);
    doc.save("report.pdf");
  };

  if (!report) return <p style={{ padding: "20px" }}>Loading report...</p>;

  return (
    <div className="container">
      <h1>Project Reports (Read-Only)</h1>

      <ul className="list">
        <li>Total Projects: <strong>{report.projects}</strong></li>
        <li>Total Tasks: <strong>{report.tasks}</strong></li>
        <li>Completed Tasks: <strong>{report.completed}</strong></li>
        <li>In-Progress Tasks: <strong>{report.in_progress}</strong></li>
        <li>Total Resources: <strong>{report.resources}</strong></li>
      </ul>

      <button onClick={downloadReport} style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Print Report
      </button>

      <p style={{ marginTop: "20px", color: "gray" }}>
        * This report is auto-generated from the system and cannot be edited.
      </p>
    </div>
  );
}

export default Reports;
