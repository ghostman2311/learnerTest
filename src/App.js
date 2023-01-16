import "./App.css";

import React, { useContext } from "react";
import { DragRowTable } from "./component/DragRowTable";

function App() {
  return (
    <div className="form-container">
      <DragRowTable />
    </div>
  );
}

export default App;
