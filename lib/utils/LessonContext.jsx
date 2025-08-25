"use client";
import { createContext, useContext, useState } from "react";

const LessonContext = createContext(null);

export const LessonProvider = ({ children, value }) => {
  const [loading, setLoading] = useState(false); 
  return (
    <LessonContext.Provider  value={{ ...value, loading, setLoading }}>{children}</LessonContext.Provider>
  );
};

export const useLessonContext = () => {
  const context = useContext(LessonContext);
  return context;
};
