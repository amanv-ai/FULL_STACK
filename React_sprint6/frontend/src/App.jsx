import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";

import Resources from "./pages/Resources";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["Admin","ProjectManager"]}>
              <Navbar />
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Projects */}
       
<Route
  path="/projects"
  element={
    <ProtectedRoute allowedRoles={["Admin", "ResourceManager", "ProjectManager"]}>
      <Navbar />
      <Projects />
    </ProtectedRoute>
  }
/>

        {/* Tasks */}
      
<Route
  path="/tasks"
  element={
    <ProtectedRoute allowedRoles={["TeamMember", "ProjectManager"]}>
      <Navbar />
      <Tasks />
    </ProtectedRoute>
  }
/>
        {/* Resources */}
        <Route
          path="/resources"
          element={
            <ProtectedRoute allowedRoles={["Admin", "ResourceManager"]}>
              <Navbar />
              <Resources />
            </ProtectedRoute>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["Admin", "ProjectManager"]}>
              <Navbar />
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
