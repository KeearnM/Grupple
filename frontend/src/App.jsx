import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import GroupbuyDisplay from "./components/GroupbuyDisplay";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GroupbuyDetails from "./pages/GroupbuyDetails";
import HostPage from "./pages/HostPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<GroupbuyDetails />} />
        <Route path="/host/:id" element={<HostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
