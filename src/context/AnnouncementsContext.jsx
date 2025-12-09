import { createContext, useEffect, useState } from "react";

export const AnnouncementsContext = createContext();

export function AnnouncementsProvider({ children }) {
  const [announcements, setAnnouncements] = useState(() => {
    const stored = localStorage.getItem("announcements");
    return stored
      ? JSON.parse(stored)
      : [
          {
            id: 1,
            title: "Monthly Islamic Lecture",
            date: "2025-11-15",
            description:
              "Join us for this month's lecture on Islamic ethics and leadership.",
          },
          {
            id: 2,
            title: "Community Charity Event",
            date: "2025-11-20",
            description:
              "TIAMSA will organize a charity drive to support local communities.",
          },
        ];
  });

  //save to local storage
  useEffect(() => {
    localStorage.setItem("announcements", JSON.stringify(announcements));
  }, [announcements]);

  const addAnnouncement = (title, content) => {
    setAnnouncements((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        description: content,
        date: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  return (
    <AnnouncementsContext.Provider
      value={{ announcements, addAnnouncement, deleteAnnouncement }}
    >
      {children}
    </AnnouncementsContext.Provider>
  );
}
