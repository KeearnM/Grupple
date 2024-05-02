import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import GroupbuyDisplay from "./components/GroupbuyDisplay";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import GroupbuyDetails from "./pages/GroupbuyDetails";
import HostPage from "./pages/HostPage";
import Profile from "./pages/Profile";
import GroupbuySummary from "./pages/GroupbuySummary";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details/:id" element={<GroupbuyDetails />} />
        <Route path="/host/:id" element={<HostPage />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/summary/:id" element={<GroupbuySummary />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
