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
          <img className="BannerImage" src={banner} alt="Banner"></img>
          <div className="bannerOverlay">
            {/* Your overlay content goes here */}
            <div className="Intro">
              <h1>Welcome to Grupple!</h1>
              Join our school of shoppers and let's school together to net the
              best deals from the vast ocean of discounts! Dive in, swim along,
              and let's make a splash with every purchase!{" "}
            </div>
          </div>
        </div>
      )}
      <div className="sectionHeaders">Take a look at the group buys!</div>
      <GroupbuyDisplay></GroupbuyDisplay>
      {isModalOpen && <Modal onClose={() => setModalOpen(false)}></Modal>}
    </>
  );
};

export default Home;
