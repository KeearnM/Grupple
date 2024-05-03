import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { UserContext } from "../components/UserContext";
import HostListing from "../components/HostListing";
import ModalGroupbuy from "../components/ModalGroupbuy";

const HostPage = () => {
  const host_url = import.meta.env.VITE_HOST_LINK;
  const [hostBuys, setHostBuys] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);

  const fetchData = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessCode}`,
        },
        body: JSON.stringify({ user_id: userId }),
      };

      const res = await fetch(host_url + `groupbuys/host/id`, requestOptions);
      const data = await res.json();
      setHostBuys(data);
    } catch (error) {
      console.log("Error!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(hostBuys);
  }, [hostBuys]);

  return (
    <div>
      <Navbar accessCode={accessCode}></Navbar>
      <h1>Hosted Group buys</h1>
      {hostBuys.map((e) => {
        return <HostListing hostBuys={e}></HostListing>;
      })}
      {isModalOpen && (
        <ModalGroupbuy onClose={() => setModalOpen(false)}></ModalGroupbuy>
      )}
      <button className="purpleButton" onClick={() => setModalOpen(true)}>
        Add Groupbuy
      </button>
    </div>
  );
};

export default HostPage;
