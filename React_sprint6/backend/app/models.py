from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database import Base


class UserRoles(Base):
    __tablename__ = "UserRoles"
    __table_args__ = {"schema": "dbo"}

    RoleID = Column(Integer, primary_key=True)
    RoleName = Column(String(50))


class UserDetails(Base):
    __tablename__ = "UserDetails"
    __table_args__ = {"schema": "dbo"}

    UserID = Column(Integer, primary_key=True)
    FullName = Column(String(100))
    Email = Column(String(100), unique=True)
    PasswordHash = Column(String(255))
    RoleID = Column(Integer, ForeignKey("dbo.UserRoles.RoleID"))


class ProjectDetails(Base):
    __tablename__ = "ProjectDetails"
    __table_args__ = {"schema": "dbo"}

    ProjectID = Column(Integer, primary_key=True)
    Title = Column(String(150))
    Description = Column(String)
    StartDate = Column(Date)
    EndDate = Column(Date)
    ProjectManagerID = Column(Integer, ForeignKey("dbo.UserDetails.UserID"))


class TaskDetails(Base):
    __tablename__ = "TaskDetails"
    __table_args__ = {"schema": "dbo"}

    TaskID = Column(Integer, primary_key=True)
    Title = Column(String(150))
    Status = Column(String(30))
    CreatedDate = Column(Date)
    CompletedDate = Column(Date)
    ProjectID = Column(Integer, ForeignKey("dbo.ProjectDetails.ProjectID"))
    AssignedTo = Column(Integer, ForeignKey("dbo.UserDetails.UserID"))


class ResourceDetails(Base):
    __tablename__ = "ResourceDetails"
    __table_args__ = {"schema": "dbo"}

    ResourceID = Column(Integer, primary_key=True)
    ResourceName = Column(String(100))
    Skill = Column(String(100))
    WorkloadShare = Column(Integer)

class ProjectTeam(Base):
    __tablename__ = "ProjectTeam"
    __table_args__ = {"schema": "dbo"}

    TeamID = Column(Integer, primary_key=True)
    ProjectID = Column(Integer, ForeignKey("dbo.ProjectDetails.ProjectID"))
    UserID = Column(Integer, ForeignKey("dbo.UserDetails.UserID"))
