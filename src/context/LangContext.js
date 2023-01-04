import React, { useEffect } from "react";
import { LOCALES } from "../languages/locales";

export const LanguageContext = React.createContext();

function LangProvider({ children }) {
  const [language, setLanguage] = React.useState(getLanguage());

  function getLanguage() {
    return localStorage.getItem("locale") || LOCALES.ENGLISH;
  }
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LangProvider };
