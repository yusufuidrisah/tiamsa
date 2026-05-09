from typing import Literal

from pydantic import BaseModel, ConfigDict


StudentStatus = Literal["pending", "registered", "rejected", "graduated"]
Gender = Literal["male", "female"]
Level = Literal["certificate", "diploma", "degree"]


class StudentBase(BaseModel):
    f_name: str
    m_name: str = ""
    l_name: str
    gender: Gender
    campus: str
    level: Level
    course: str
    year: str = ""
    email: str
    phone: str
    studentID: str | None = None


class StudentCreate(StudentBase):
    regNo: str
    status: StudentStatus = "pending"


class StudentUpdate(StudentBase):
    status: StudentStatus = "pending"


class StudentStatusUpdate(BaseModel):
    status: StudentStatus


class BulkStudentStatusUpdate(BaseModel):
    regNos: list[str]
    status: StudentStatus


class BulkStudentDelete(BaseModel):
    regNos: list[str]


class StudentResponse(StudentBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    regNo: str
    status: StudentStatus
    approvedAt: str | None = None
    createdAt: str | None = None
    updatedAt: str | None = None


class AnnouncementPayload(BaseModel):
    title: str
    content: str
    attachment: str | None = None
    category: str = "General"
    pinned: bool = False
    publishedBy: str = "TIAMSA Admin"


class BulkAnnouncementDelete(BaseModel):
    ids: list[int]


class AnnouncementResponse(BaseModel):
    id: int
    title: str
    content: str
    description: str
    attachment: str | None = None
    attachmentType: str | None = None
    category: str
    pinned: bool
    publishedBy: str
    date: str | None = None
    updatedAt: str | None = None
