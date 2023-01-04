import React from "react";
import { Dropdown } from "react-bootstrap";
import { LanguageContext } from "../context/LangContext";

const LANGUAGES = ["en-US", "hi-IN", "pb-IN", "ur-IN"];

function LocalePicker() {
  const { language, setLanguage } = React.useContext(LanguageContext);
  const onLanguageChange = (item) => {
    setLanguage(item);
    localStorage.setItem("locale", item);
  };
  return (
    <div className="locale-picker-wrapper">
      <Dropdown className="locale-picker__dropdown-wrapper_language-only">
        <Dropdown.Toggle>
          <div>
            <section>Icon</section>
            <p>{language}</p>
          </div>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <section>
            <p>Select Langauge</p>
          </section>
          <ul>
            {LANGUAGES.map((item, index) => {
              return (
                <li key={`${index}_${item}`}>
                  <button onClick={() => onLanguageChange(item)}>{item}</button>
                </li>
              );
            })}
          </ul>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default LocalePicker;
