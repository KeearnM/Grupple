import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import GroupbuyDisplay from "../components/GroupbuyDisplay";
import Login from "../components/Login";
import banner from "../assets/banner.jpg";
import Modal from "../components/Modal";
import { UserContext } from "../components/UserContext";
import JoinedBuys from "../components/JoinedBuys";

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);

  return (
    <>
      <Navbar accessCode={accessCode} setModalOpen={setModalOpen}></Navbar>
      {accessCode ? (
        <JoinedBuys></JoinedBuys>
      ) : (
        <div className="Banner">
          <img className="BannerImage" src={banner}></img>
        </div>
      )}
      <div className="sectionHeaders">Take a look at the group buys!</div>
      <GroupbuyDisplay></GroupbuyDisplay>
      {isModalOpen && <Modal onClose={() => setModalOpen(false)}></Modal>}
      {/* <button onClick={() => setModalOpen(true)}>Open Login Modal</button>
      <div>Access Code: {accessCode}</div> */}
    </>
  );
};

export default Home;
