import { createContext, useContext, useState } from "react";

const StudentsContext = createContext();

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState([
    { id: 1, name: "Aisha", gender: "female", regNo: "TIA001" },
    { id: 2, name: "Abdallah", gender: "male", regNo: "TIA002" },
    { id: 3, name: "Fatma", gender: "female", regNo: "TIA003" },
  ]);

  return (
    <StudentsContext.Provider value={{ students, setStudents }}>
      {children}
    </StudentsContext.Provider>
  );
}

export const useStudents = () => useContext(StudentsContext);
