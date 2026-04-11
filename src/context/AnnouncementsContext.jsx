import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export const AnnouncementsContext = createContext();

export function AnnouncementsProvider({ children }) {
  const [announcements, setAnnouncements] = useState(() => {
    const stored = localStorage.getItem("announcements");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("announcements", JSON.stringify(announcements));
  }, [announcements]);

  const addAnnouncement = async (title, content, attachment) => {
    const newEntry = {
      id: Date.now(),
      title,
      description: content,
      attachment, // Hifadhi base64 string hapa
      date: new Date().toISOString().split("T")[0],
    };
    setAnnouncements((prev) => [newEntry, ...prev]);
    await Swal.fire({
      title: "Published",
      text: `"${title}" has been published successfully.`,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#115c3a",
    });
  };

  const updateAnnouncement = async (id, updatedData) => {
    setAnnouncements((prev) =>
      prev.map((ann) =>
        ann.id === id
          ? {
              ...ann,
              title: updatedData.title,
              description: updatedData.content,
              attachment: updatedData.attachment,
            }
          : ann,
      ),
    );
    await Swal.fire({
      title: "Updated",
      text: `"${updatedData.title}" has been updated successfully.`,
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#115c3a",
    });
  };

  const deleteAnnouncement = async (id, title = "this announcement") => {
    const result = await Swal.fire({
      title: "Delete announcement?",
      text: `"${title}" will no longer be visible to students.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete announcement",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
      await Swal.fire({
        title: "Deleted",
        text: `"${title}" has been deleted successfully.`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#115c3a",
      });
    }
  };

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
}
