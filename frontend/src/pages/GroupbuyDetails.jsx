import { useContext, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { UserContext } from "../components/UserContext";
import Modal from "../components/Modal";

const GroupbuyDetails = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);
  const { id: groupbuyId } = useParams(); // Destructure the ID directly

  const [groupbuy, setGroupbuy] = useState(null); // Initialize with null

  const host_url = import.meta.env.VITE_HOST_LINK;

  console.log(groupbuyId);

  const fetchData = async () => {
    try {
      const res = await fetch(host_url + `groupbuy/${groupbuyId}`);
      const data = await res.json();
      setGroupbuy(data);
      console.log(groupbuy); // This might still log the initial state
    } catch (error) {
      console.log("Error!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Log the updated state
    console.log(groupbuy);
  }, [groupbuy]); // Depend on groupbuy to log its updated value

  return (
    <>
      {groupbuy ? (
        <>
          <Navbar accessCode={accessCode} setModalOpen={setModalOpen}></Navbar>
          {isModalOpen && <Modal onClose={() => setModalOpen(false)}></Modal>}
          <h1>{groupbuy.title}</h1>
          <div>Image goes here</div>
          <div>{groupbuy.description}</div>
          <button onClick={() => console.log(groupbuy.listings)}>
            Log Groupbuy
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default GroupbuyDetails;
