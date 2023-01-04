import "./App.css";

import React, { useContext } from "react";
import { IntlProvider } from "react-intl";
import { FormQuestions } from "./component/Form";
import { LanguageContext } from "./context/LangContext";
import { LOCALES } from "./languages/locales";
import { MESSAGES } from "./languages/messages";

function App() {
  const { language } = useContext(LanguageContext);
  return (
    <IntlProvider
      locale={language}
      defaultLocale={LOCALES.ENGLISH}
      messages={MESSAGES[language]}
    >
      <div className="form-container">
        <FormQuestions />
      </div>
    </IntlProvider>
  );
}

export default App;
