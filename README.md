# 📌 Project Task & Resource Management System (PTRMS)

A full-stack **Role-Based Project, Task, and Resource Management
System** built using:

-   ⚛️ React (Frontend)
-   ⚡ FastAPI (Backend)
-   🗄️ SQL Server (Database)
-   🔐 JWT Authentication
-   🛡️ Role-Based Access Control (RBAC)

This system enables structured project execution with secure access
control and automated business logic.

------------------------------------------------------------------------

# 🚀 Features

-   Secure JWT-based authentication
-   Role-Based Access Control (RBAC)
-   Project creation and assignment
-   Task creation and tracking
-   Resource allocation and workload calculation
-   Automatic project completion tracking
-   Report viewing and downloading
-   Clean modular backend architecture
-   Centralized API handling in frontend

------------------------------------------------------------------------

# 🧠 System Architecture

User (Browser) ↓ React Frontend ↓ (REST API with JWT) FastAPI Backend ↓
SQL Server Database

-   Frontend handles UI and routing.
-   Backend handles authentication, authorization, and business logic.
-   Database stores persistent structured data.

------------------------------------------------------------------------

# 🔐 User Roles & Permissions

## 🔴 Admin

-   Add new users
-   View dashboard statistics
-   View and delete tasks
-   View resources
-   View & download reports

## 🟠 Product Manager

-   View assigned projects
-   Create and assign tasks
-   Monitor task progress
-   View resources
-   View & download reports

## 🟡 Resource Manager

-   Create projects
-   Assign Product Managers
-   Allocate team members to projects
-   View resources
-   View & download reports

## 🟢 Team Member

-   View assigned tasks
-   Update task status (To-Do → In-Progress → Done)
-   View related project details

------------------------------------------------------------------------

# 📡 API Endpoints

## 🔐 Authentication

-   POST /login

## 📊 Dashboard

-   GET /dashboard

## 👤 Users

-   POST /users
-   GET /users

## 📁 Projects

-   GET /projects
-   GET /pm-projects
-   POST /projects
-   GET /my-projects

## 🧩 Tasks

-   GET /tasks
-   POST /tasks
-   PUT /tasks/{task_id}
-   DELETE /tasks/{task_id}
-   GET /my-tasks

## 👥 Resources

-   GET /resources
-   POST /allocate-resource
-   GET /project-managers

------------------------------------------------------------------------

# ⚙️ Business Logic Automation

-   Automatic project completion when all tasks are marked "Done"
-   Dynamic workload recalculation after task creation or deletion
-   Backend-enforced security validation
-   Clean separation of concerns (UI, validation, business logic,
    storage)

------------------------------------------------------------------------

# 🛠️ Setup Instructions

## Backend Setup

cd backend python -m venv venv
venv`\Scripts`{=tex}`\activate  `{=tex}(Windows) pip install -r
requirements.txt uvicorn app.main:app --reload

Backend runs at: http://127.0.0.1:8000

Swagger Docs: http://127.0.0.1:8000/docs

------------------------------------------------------------------------

## Frontend Setup

cd frontend npm install npm start

Frontend runs at: http://localhost:3000

------------------------------------------------------------------------

# 📂 Project Structure

## Frontend

frontend/ ├── src/ │ ├── components/ │ ├── pages/ │ ├── services/ │ ├──
css/ │ ├── App.jsx │ └── main.jsx

## Backend

backend/ ├── app/ │ ├── main.py │ ├── models.py │ ├── schemas.py │ ├──
auth.py │ ├── rbac.py │ └── database.py

------------------------------------------------------------------------

# 🔐 Security Overview

-   JWT token-based authentication
-   Role-based API protection
-   Backend validation of all requests
-   Password hashing using SHA-256
-   Token expiration handling

------------------------------------------------------------------------

# 📌 Future Improvements

-   Email notifications
-   Audit logging
-   Pagination and filtering
-   Advanced reporting
-   Docker deployment
-   CI/CD integration

------------------------------------------------------------------------

# 📄 License

This project is for educational and demonstration purposes.
