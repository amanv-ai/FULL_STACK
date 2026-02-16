from pydantic import BaseModel
from datetime import date

class LoginRequest(BaseModel):
    email: str
    password: str


class TaskUpdate(BaseModel):
    status: str


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    role_id: int

class ProjectCreate(BaseModel):
    title: str
    description: str
    # start_date: date
    # end_date: date
    manager_id: int

class ResourceAllocate(BaseModel):
    user_id: int
    project_id: int
class TaskCreate(BaseModel):
    title: str
    project_id: int
    assigned_to: int
