import { createContext, useEffect, useState } from "react";

export const AnnouncementsContext = createContext();

export function AnnouncementsProvider({ children }) {
  const [announcements, setAnnouncements] = useState(() => {
    const stored = localStorage.getItem("announcements");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("announcements", JSON.stringify(announcements));
  }, [announcements]);

  const addAnnouncement = (title, content, attachment) => {
    const newEntry = {
      id: Date.now(),
      title,
      description: content,
      attachment, // Hifadhi base64 string hapa
      date: new Date().toISOString().split("T")[0],
    };
    setAnnouncements((prev) => [newEntry, ...prev]);
  };

  const updateAnnouncement = (id, updatedData) => {
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
  };

  const deleteAnnouncement = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
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
