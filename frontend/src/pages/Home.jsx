import React from "react";
import Navbar from "../components/Navbar";
import GroupbuyDisplay from "../components/GroupbuyDisplay";
import Test from "../components/Test";
import banner from "./assets/banner.jpg";

const Home = () => {
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
};

export default Home;
