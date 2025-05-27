import React from "react";
import { ToastContainer } from "react-toastify";

import "./assets/scss/themes.scss";

import Route from "./Routes";

function App() {
  return (
    <React.Fragment>
      <Route />
      <ToastContainer />
    </React.Fragment>
  );
}

export default App;
