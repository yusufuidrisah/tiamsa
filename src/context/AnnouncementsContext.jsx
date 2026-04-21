import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export const AnnouncementsContext = createContext();

export function AnnouncementsProvider({ children }) {
  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });

  const [announcements, setAnnouncements] = useState(() => {
    const stored = localStorage.getItem("announcements");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("announcements", JSON.stringify(announcements));
  }, [announcements]);

  const nowDate = () => new Date().toISOString().split("T")[0];

  const addAnnouncement = async (announcementData) => {
    const newEntry = {
      id: Date.now(),
      title: announcementData.title,
      description: announcementData.content,
      attachment: announcementData.attachment,
      category: announcementData.category || "General",
      pinned: Boolean(announcementData.pinned),
      publishedBy: announcementData.publishedBy || "TIAMSA Admin",
      date: nowDate(),
      updatedAt: nowDate(),
    };
    setAnnouncements((prev) => [newEntry, ...prev]);
    await toast.fire({
      title: "Published",
      text: `"${announcementData.title}" has been published successfully.`,
      icon: "success",
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
              category: updatedData.category || ann.category || "General",
              pinned:
                typeof updatedData.pinned === "boolean"
                  ? updatedData.pinned
                  : Boolean(ann.pinned),
              publishedBy:
                updatedData.publishedBy || ann.publishedBy || "TIAMSA Admin",
              updatedAt: nowDate(),
            }
          : ann,
      ),
    );
    await toast.fire({
      title: "Updated",
      text: `"${updatedData.title}" has been updated successfully.`,
      icon: "success",
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
      await toast.fire({
        title: "Deleted",
        text: `"${title}" has been deleted successfully.`,
        icon: "success",
      });
    }
  };

  const bulkDeleteAnnouncements = async (ids) => {
    const result = await Swal.fire({
      title: "Delete selected announcements?",
      text: `${ids.length} announcements will be removed from the notice board.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete selected",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#94a3b8",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setAnnouncements((prev) => prev.filter((item) => !ids.includes(item.id)));
      await toast.fire({
        title: "Deleted",
        text: `${ids.length} announcements were removed.`,
        icon: "success",
      });
      return true;
    }

    return false;
  };

  return (
    <AnnouncementsContext.Provider
      value={{
        announcements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        bulkDeleteAnnouncements,
      }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
}
