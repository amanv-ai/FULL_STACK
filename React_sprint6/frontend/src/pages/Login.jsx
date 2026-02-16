import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../css/Login.css";
;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/login", {
        email,
        password,
      });

      const { token, role, name } = res.data;

      // Store auth details
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);

      // Redirect based on role
      if (role === "Admin") navigate("/");
      else if (role === "ProjectManager") navigate("/projects");
      else if (role === "TeamMember") navigate("/tasks");
      else if (role === "ResourceManager") navigate("/resources");
      else navigate("/login");

    } catch (err) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT */}
      <div className="login-left">
        <h1>muTracker</h1>
        <p>
          Project Task & Resource <br />
          Management System
        </p>
      </div>

      {/* RIGHT */}
      <div className="login-right">
        <div className="login-box">
          <h2>Login</h2>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
