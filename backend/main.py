from contextlib import closing

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .database import get_connection, init_db
from .schemas import (
    AnnouncementPayload,
    AnnouncementResponse,
    BulkAnnouncementDelete,
    BulkStudentDelete,
    BulkStudentStatusUpdate,
    StudentCreate,
    StudentResponse,
    StudentStatusUpdate,
    StudentUpdate,
)


app = FastAPI(title="TIAMSA API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


def detect_attachment_type(attachment: str | None) -> str | None:
    if not attachment:
        return None
    if attachment.startswith("data:image"):
        return "image"
    if attachment.startswith("data:application/pdf"):
        return "pdf"
    return "file"


def map_student(row) -> StudentResponse:
    return StudentResponse(
        id=row["id"],
        regNo=row["reg_no"],
        f_name=row["f_name"],
        m_name=row["m_name"] or "",
        l_name=row["l_name"],
        gender=row["gender"],
        campus=row["campus"],
        level=row["level"],
        course=row["course"],
        year=row["year_of_study"] or "",
        email=row["email"],
        phone=row["phone"],
        studentID=row["photo_data"],
        status=row["status"],
        approvedAt=row["approved_at"],
        createdAt=row["created_at"],
        updatedAt=row["updated_at"],
    )


def map_announcement(row) -> AnnouncementResponse:
    created_at = row["created_at"].split(" ")[0] if row["created_at"] else None
    updated_at = row["updated_at"].split(" ")[0] if row["updated_at"] else None
    return AnnouncementResponse(
        id=row["id"],
        title=row["title"],
        content=row["content"],
        description=row["content"],
        attachment=row["attachment_data"],
        attachmentType=row["attachment_type"],
        category=row["category"],
        pinned=bool(row["pinned"]),
        publishedBy=row["published_by"],
        date=created_at,
        updatedAt=updated_at,
    )


@app.get("/api/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.get("/api/students", response_model=list[StudentResponse])
def list_students() -> list[StudentResponse]:
    with closing(get_connection()) as connection:
        rows = connection.execute(
            "SELECT * FROM students ORDER BY datetime(created_at) DESC, id DESC"
        ).fetchall()
    return [map_student(row) for row in rows]


@app.post("/api/students", status_code=201)
def create_student(payload: StudentCreate) -> dict[str, bool]:
    with closing(get_connection()) as connection:
        connection.execute(
            """
            INSERT INTO students (
              reg_no, f_name, m_name, l_name, gender, campus, level, course,
              year_of_study, email, phone, photo_data, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.regNo,
                payload.f_name,
                payload.m_name,
                payload.l_name,
                payload.gender,
                payload.campus,
                payload.level,
                payload.course,
                payload.year,
                payload.email,
                payload.phone,
                payload.studentID,
                payload.status,
            ),
        )
        connection.commit()
    return {"ok": True}


@app.put("/api/students/{reg_no}")
def update_student(reg_no: str, payload: StudentUpdate) -> dict[str, bool]:
    with closing(get_connection()) as connection:
        current = connection.execute(
            "SELECT id, status FROM students WHERE reg_no = ?",
            (reg_no,),
        ).fetchone()

        if current is None:
            raise HTTPException(status_code=404, detail="Student not found.")

        connection.execute(
            """
            UPDATE students
            SET
              f_name = ?,
              m_name = ?,
              l_name = ?,
              gender = ?,
              campus = ?,
              level = ?,
              course = ?,
              year_of_study = ?,
              email = ?,
              phone = ?,
              photo_data = ?,
              status = ?,
              approved_at = CASE
                WHEN ? = 'registered' THEN COALESCE(approved_at, CURRENT_TIMESTAMP)
                ELSE approved_at
              END,
              updated_at = CURRENT_TIMESTAMP
            WHERE reg_no = ?
            """,
            (
                payload.f_name,
                payload.m_name,
                payload.l_name,
                payload.gender,
                payload.campus,
                payload.level,
                payload.course,
                payload.year,
                payload.email,
                payload.phone,
                payload.studentID,
                payload.status,
                payload.status,
                reg_no,
            ),
        )

        if payload.status != current["status"]:
            connection.execute(
                """
                INSERT INTO student_status_history (student_id, previous_status, new_status)
                VALUES (?, ?, ?)
                """,
                (current["id"], current["status"], payload.status),
            )

        connection.commit()
    return {"ok": True}


@app.patch("/api/students/{reg_no}/status")
def update_student_status(
    reg_no: str, payload: StudentStatusUpdate
) -> dict[str, bool]:
    with closing(get_connection()) as connection:
        current = connection.execute(
            "SELECT id, status FROM students WHERE reg_no = ?",
            (reg_no,),
        ).fetchone()

        if current is None:
            raise HTTPException(status_code=404, detail="Student not found.")

        connection.execute(
            """
            UPDATE students
            SET
              status = ?,
              approved_at = CASE WHEN ? = 'registered' THEN CURRENT_TIMESTAMP ELSE approved_at END,
              updated_at = CURRENT_TIMESTAMP
            WHERE reg_no = ?
            """,
            (payload.status, payload.status, reg_no),
        )
        connection.execute(
            """
            INSERT INTO student_status_history (student_id, previous_status, new_status)
            VALUES (?, ?, ?)
            """,
            (current["id"], current["status"], payload.status),
        )
        connection.commit()
    return {"ok": True}


@app.post("/api/students/bulk-status")
def bulk_update_student_status(
    payload: BulkStudentStatusUpdate,
) -> dict[str, bool]:
    with closing(get_connection()) as connection:
        for reg_no in payload.regNos:
            current = connection.execute(
                "SELECT id, status FROM students WHERE reg_no = ?",
                (reg_no,),
            ).fetchone()
            if current is None:
                continue

            connection.execute(
                """
                UPDATE students
                SET
                  status = ?,
                  approved_at = CASE WHEN ? = 'registered' THEN CURRENT_TIMESTAMP ELSE approved_at END,
                  updated_at = CURRENT_TIMESTAMP
                WHERE reg_no = ?
                """,
                (payload.status, payload.status, reg_no),
            )
            connection.execute(
                """
                INSERT INTO student_status_history (student_id, previous_status, new_status)
                VALUES (?, ?, ?)
                """,
                (current["id"], current["status"], payload.status),
            )
        connection.commit()
    return {"ok": True}


@app.delete("/api/students/{reg_no}", status_code=204)
def delete_student(reg_no: str) -> None:
    with closing(get_connection()) as connection:
        connection.execute("DELETE FROM students WHERE reg_no = ?", (reg_no,))
        connection.commit()


@app.post("/api/students/bulk-delete")
def bulk_delete_students(payload: BulkStudentDelete) -> dict[str, bool]:
    with closing(get_connection()) as connection:
        for reg_no in payload.regNos:
            connection.execute("DELETE FROM students WHERE reg_no = ?", (reg_no,))
        connection.commit()
    return {"ok": True}


@app.get("/api/announcements", response_model=list[AnnouncementResponse])
def list_announcements() -> list[AnnouncementResponse]:
    with closing(get_connection()) as connection:
        rows = connection.execute(
            """
            SELECT * FROM announcements
            ORDER BY pinned DESC, datetime(created_at) DESC, id DESC
            """
        ).fetchall()
    return [map_announcement(row) for row in rows]


@app.post("/api/announcements", status_code=201)
def create_announcement(payload: AnnouncementPayload) -> dict[str, bool]:
    with closing(get_connection()) as connection:
        connection.execute(
            """
            INSERT INTO announcements (
              title, content, attachment_data, attachment_type, category, pinned, published_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.title,
                payload.content,
                payload.attachment,
                detect_attachment_type(payload.attachment),
                payload.category,
                int(payload.pinned),
                payload.publishedBy,
            ),
        )
        connection.commit()
    return {"ok": True}


@app.put("/api/announcements/{announcement_id}")
def update_announcement(
    announcement_id: int, payload: AnnouncementPayload
) -> dict[str, bool]:
    with closing(get_connection()) as connection:
        connection.execute(
            """
            UPDATE announcements
            SET
              title = ?,
              content = ?,
              attachment_data = ?,
              attachment_type = ?,
              category = ?,
              pinned = ?,
              published_by = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                payload.title,
                payload.content,
                payload.attachment,
                detect_attachment_type(payload.attachment),
                payload.category,
                int(payload.pinned),
                payload.publishedBy,
                announcement_id,
            ),
        )
        connection.commit()
    return {"ok": True}


@app.delete("/api/announcements/{announcement_id}", status_code=204)
def delete_announcement(announcement_id: int) -> None:
    with closing(get_connection()) as connection:
        connection.execute("DELETE FROM announcements WHERE id = ?", (announcement_id,))
        connection.commit()


@app.post("/api/announcements/bulk-delete")
def bulk_delete_announcements(
    payload: BulkAnnouncementDelete,
) -> dict[str, bool]:
    with closing(get_connection()) as connection:
        for announcement_id in payload.ids:
            connection.execute(
                "DELETE FROM announcements WHERE id = ?",
                (announcement_id,),
            )
        connection.commit()
    return {"ok": True}
