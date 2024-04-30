import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import GroupbuyDisplay from "./components/GroupbuyDisplay";
import "./index.css";
import Navbar from "./components/Navbar";
import Test from "./components/Test";
import banner from "./assets/banner.jpg";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <div className="Banner">
        <img className="BannerImage" src={banner}></img>
      </div>
      <GroupbuyDisplay></GroupbuyDisplay>
      <Test></Test>
    </>
  );
}

export default App;
