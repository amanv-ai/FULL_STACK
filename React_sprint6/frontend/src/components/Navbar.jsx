import { useNavigate, useLocation } from "react-router-dom";
import "../css/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  // Hide navbar on login page
  if (location.pathname === "/login") return null;

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>PTRMS</h2>
      </div>

      <div className="nav-center">
        {role === "Admin" && (
          <>
            <button 
              className={location.pathname === "/" ? "active" : ""} 
              onClick={() => navigate("/")}
            >
              Dashboard
            </button>
            <button 
              className={location.pathname === "/projects" ? "active" : ""} 
              onClick={() => navigate("/projects")}
            >
              Projects
            </button>
            <button 
              className={location.pathname === "/resources" ? "active" : ""} 
              onClick={() => navigate("/resources")}
            >
              Resources
            </button>
            <button 
              className={location.pathname === "/reports" ? "active" : ""} 
              onClick={() => navigate("/reports")}
            >
              Reports
            </button>
          </>
        )}

        {role === "ProjectManager" && (
          <>
            <button 
              className={location.pathname === "/" ? "active" : ""} 
              onClick={() => navigate("/")}
            >
              Dashboard
            </button>
            <button 
              className={location.pathname === "/projects" ? "active" : ""} 
              onClick={() => navigate("/projects")}
            >
              Projects
            </button>
            <button 
              className={location.pathname === "/tasks" ? "active" : ""} 
              onClick={() => navigate("/tasks")}
            >
              Tasks
            </button>
            <button 
              className={location.pathname === "/reports" ? "active" : ""} 
              onClick={() => navigate("/reports")}
            >
              Reports
            </button>
          </>
        )}

        {role === "TeamMember" && (
          <>
            <button 
              className={location.pathname === "/tasks" ? "active" : ""} 
              onClick={() => navigate("/tasks")}
            >
              My Tasks
            </button>
          </>
        )}

        {role === "ResourceManager" && (
          <>
            <button 
              className={location.pathname === "/projects" ? "active" : ""} 
              onClick={() => navigate("/projects")}
            >
              Projects
            </button>
            <button 
              className={location.pathname === "/resources" ? "active" : ""} 
              onClick={() => navigate("/resources")}
            >
              Resources
            </button>
          </>
        )}
      </div>

      <div className="nav-right">
        <div className="profile-section">
          <div className="profile-avatar">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="username">{name}</span>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;