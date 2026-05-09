import { createContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { announcementsApi } from "../services/api";

export const AnnouncementsContext = createContext();

export function AnnouncementsProvider({ children }) {
  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });

  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementsApi.list();
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to load announcements:", error);
    }
  };

  const addAnnouncement = async (announcementData) => {
    try {
      await announcementsApi.create(announcementData);
      await loadAnnouncements();
      await toast.fire({
        title: "Published",
        text: `"${announcementData.title}" has been published successfully.`,
        icon: "success",
      });
    } catch (error) {
      await Swal.fire({
        title: "Server connection problem",
        text: error.message || "Could not publish the announcement.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const updateAnnouncement = async (id, updatedData) => {
    try {
      await announcementsApi.update(id, updatedData);
      await loadAnnouncements();
      await toast.fire({
        title: "Updated",
        text: `"${updatedData.title}" has been updated successfully.`,
        icon: "success",
      });
    } catch (error) {
      await Swal.fire({
        title: "Server connection problem",
        text: error.message || "Could not update the announcement.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
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
      try {
        await announcementsApi.remove(id);
        await loadAnnouncements();
        await toast.fire({
          title: "Deleted",
          text: `"${title}" has been deleted successfully.`,
          icon: "success",
        });
      } catch (error) {
        await Swal.fire({
          title: "Server connection problem",
          text: error.message || "Could not delete the announcement.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
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
      try {
        await announcementsApi.bulkDelete(ids);
        await loadAnnouncements();
        await toast.fire({
          title: "Deleted",
          text: `${ids.length} announcements were removed.`,
          icon: "success",
        });
        return true;
      } catch (error) {
        await Swal.fire({
          title: "Server connection problem",
          text: error.message || "Could not delete the announcements.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
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
