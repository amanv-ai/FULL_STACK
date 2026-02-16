from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import models, schemas
from app.auth import verify_password, create_token, hash_password
from app.rbac import require_role, get_current_user


app = FastAPI(title="PTRMS Backend")

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DB SESSION ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- AUTH ----------------

@app.post("/login")
def login(data: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.UserDetails).filter(
        models.UserDetails.Email == data.email
    ).first()

    if not user or not verify_password(data.password, user.PasswordHash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    role = db.query(models.UserRoles).filter(
        models.UserRoles.RoleID == user.RoleID
    ).first()

    token = create_token({
        "email": user.Email,
        "role": role.RoleName,
        "name": user.FullName
    })

    return {
        "token": token,
        "role": role.RoleName,
        "name": user.FullName
    }


# ---------------- DASHBOARD ----------------

@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):
    return {
        "projects": db.query(models.ProjectDetails).count(),
        "tasks": db.query(models.TaskDetails).count(),
        "completed": db.query(models.TaskDetails)
            .filter(models.TaskDetails.Status == "Done").count(),
        "in_progress": db.query(models.TaskDetails)
            .filter(models.TaskDetails.Status == "In-Progress").count(),
        "resources": db.query(models.ResourceDetails).count(),
    }


# ---------------- USERS (ADMIN) ----------------

@app.post("/users", dependencies=[Depends(require_role(["Admin"]))])
def add_user(data: schemas.UserCreate, db: Session = Depends(get_db)):

    user = models.UserDetails(
        FullName=data.full_name,
        Email=data.email,
        PasswordHash=hash_password(data.password),
        RoleID=data.role_id
    )

    db.add(user)
    db.commit()

    return {"status": "User created successfully"}



# ---------------- PROJECTS ----------------

@app.get("/projects", dependencies=[Depends(require_role(["Admin", "ResourceManager","ProjectManager"]))])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.ProjectDetails).all()


@app.post("/projects", dependencies=[Depends(require_role(["ResourceManager"]))])
def create_project(data: schemas.ProjectCreate, db: Session = Depends(get_db)):
    from datetime import date
    
    project = models.ProjectDetails(
        Title=data.title,
        Description=data.description,
        StartDate=date.today(),  # Automatically set to today
        EndDate=None,  # Optional, can be set later
        ProjectManagerID=data.manager_id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return {"status": "Project created", "project_id": project.ProjectID}

# ---------------- TASKS ----------------

# ---------------- TASKS ----------------

@app.get("/tasks", dependencies=[Depends(require_role(["Admin", "ProjectManager"]))])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.TaskDetails).all()

@app.post("/tasks", dependencies=[Depends(require_role(["ProjectManager"]))])
def create_task(data: schemas.TaskCreate, db: Session = Depends(get_db)):
    from datetime import date
    
    task = models.TaskDetails(
        Title=data.title,
        ProjectID=data.project_id,
        AssignedTo=data.assigned_to,
        Status="To-Do",
        CreatedDate=date.today()
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"status": "Task created", "task_id": task.TaskID}

@app.put("/tasks/{task_id}", dependencies=[Depends(require_role(["TeamMember"]))])
def update_task(task_id: int, data: schemas.TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.TaskDetails).filter(
        models.TaskDetails.TaskID == task_id
    ).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.Status = data.status
    db.commit()
    return {"status": "Task updated"}

@app.delete("/tasks/{task_id}", dependencies=[Depends(require_role(["ProjectManager"]))])
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db.query(models.TaskDetails).filter(
        models.TaskDetails.TaskID == task_id
    ).delete()
    db.commit()
    return {"status": "Task deleted"}

# ---------------- USERS ----------------

@app.get("/users", dependencies=[Depends(require_role(["ProjectManager"]))])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.UserDetails).all()


# ---------------- TEAM MEMBER FILTERED VIEWS ----------------

@app.get("/my-projects", dependencies=[Depends(require_role(["TeamMember"]))])
def my_projects(user=Depends(get_current_user), db: Session = Depends(get_db)):

    db_user = db.query(models.UserDetails).filter(
        models.UserDetails.Email == user["email"]
    ).first()

    # Step 1: Get unique Project IDs from tasks
    project_ids = (
        db.query(models.TaskDetails.ProjectID)
        .filter(models.TaskDetails.AssignedTo == db_user.UserID)
        .distinct()
        .all()
    )

    project_ids = [pid[0] for pid in project_ids]  # Flatten list

    # Step 2: Fetch full project details
    projects = (
        db.query(models.ProjectDetails)
        .filter(models.ProjectDetails.ProjectID.in_(project_ids))
        .all()
    )

    return projects




@app.get("/my-tasks", dependencies=[Depends(require_role(["TeamMember"]))])
def my_tasks(user=Depends(get_current_user), db: Session = Depends(get_db)):

    db_user = db.query(models.UserDetails).filter(
        models.UserDetails.Email == user["email"]
    ).first()

    return db.query(models.TaskDetails).filter(
        models.TaskDetails.AssignedTo == db_user.UserID
    ).all()


# ---------------- RESOURCES ----------------

@app.get("/resources", dependencies=[Depends(require_role(["Admin", "ResourceManager"]))])
def get_resources(db: Session = Depends(get_db)):
    return db.query(models.ResourceDetails).all()


@app.post("/allocate-resource", dependencies=[Depends(require_role(["ResourceManager"]))])
def allocate_resource(data: schemas.ResourceAllocate, db: Session = Depends(get_db)):

    allocation = models.ProjectTeam(
        ProjectID=data.project_id,
        UserID=data.user_id
    )

    db.add(allocation)
    db.commit()

    return {"status": "Resource allocated to project"}

@app.get("/project-managers", dependencies=[Depends(require_role(["ResourceManager"]))])
def get_project_managers(db: Session = Depends(get_db)):
    # Get users with ProjectManager role
    project_manager_role = db.query(models.UserRoles).filter(
        models.UserRoles.RoleName == "ProjectManager"
    ).first()
    
    if not project_manager_role:
        return []
    
    return db.query(models.UserDetails).filter(
        models.UserDetails.RoleID == project_manager_role.RoleID
    ).all()