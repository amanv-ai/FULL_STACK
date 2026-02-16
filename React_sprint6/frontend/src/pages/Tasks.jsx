import { useEffect, useState } from "react";
import API from "../services/api";
import "../css/Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    project_id: "",
    assigned_to: ""
  });

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchTasks();
    if (role === "ProjectManager") {
      fetchProjects();
      fetchUsers();
    }
  }, []);

  const fetchTasks = async () => {
  try {
    const role = localStorage.getItem("role");
    
    let url = "/tasks";
    if (role === "TeamMember") {
      url = "/my-tasks";  // Use the filtered endpoint for Team Members
    }
    
    const res = await API.get(url);
    setTasks(res.data);
  } catch (err) {
    console.error("Failed to load tasks");
  }
};

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to load projects");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const createTask = async () => {
  try {
    await API.post("/tasks", {
      title: formData.title,
      project_id: parseInt(formData.project_id),
      assigned_to: parseInt(formData.assigned_to)
    });
    setFormData({
      title: "",
      project_id: "",
      assigned_to: ""
    });
    setShowForm(false);
    fetchTasks();
  } catch (err) {
    alert("Failed to create task");
  }
};

  const updateTask = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (err) {
        alert("Failed to delete task");
      }
    }
  };

  return (
    <div className="container">
      <h1>Task Management</h1>

      {role === "ProjectManager" && (
        <button 
          className="add-task-btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Task"}
        </button>
      )}

      {showForm && role === "ProjectManager" && (
        <div className="task-form">
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Project</option>
            {projects.map(p => (
              <option key={p.ProjectID} value={p.ProjectID}>
                {p.Title}
              </option>
            ))}
          </select>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleInputChange}
            required
          >
            <option value="">Assign to User</option>
            {users.map(u => (
              <option key={u.UserID} value={u.UserID}>
                {u.FullName}
              </option>
            ))}
          </select>
          <button onClick={createTask}>Create Task</button>
        </div>
      )}

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.TaskID} className="task-card">
              <h3>{task.Title}</h3>
              <p><strong>Status:</strong> {task.Status}</p>
              
              {role === "TeamMember" && (
                <div className="task-actions">
                  <label>Update Status:</label>
                  <select
                    value={task.Status}
                    onChange={(e) => updateTask(task.TaskID, e.target.value)}
                  >
                    <option value="To-Do">To-Do</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              )}
              
              {role === "ProjectManager" && (
                <button 
                  className="delete-btn" 
                  onClick={() => deleteTask(task.TaskID)}
                >
                  Delete Task
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;