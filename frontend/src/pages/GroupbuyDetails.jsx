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
  const [selectedListing, setSelectedListing] = useState(""); // State for selected dropdown value
  const [numberInput, setNumberInput] = useState(""); // State for number input

  const host_url = import.meta.env.VITE_HOST_LINK;

  console.log(groupbuyId);

  const fetchData = async () => {
    try {
      const res = await fetch(host_url + `groupbuy/detail/${groupbuyId}`);
      const data = await res.json();
      setGroupbuy(data);
      console.log(groupbuy); // This might still log the initial state
    } catch (error) {
      console.log("Error!", error);
    }
  };

  const participationSubmit = async () => {
    const requestBody = {
      amount: numberInput,
      listing_id: selectedListing,
      user_id: userId,
    };

    try {
      const response = await fetch(`${host_url}participants`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessCode}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to join");
      }

      const data = await response.json();
      console.log("Joined successfully:", data);
    } catch (error) {
      console.error("Error joining:", error);
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
          <div>
            <h1 className="productTitle">{groupbuy.title}</h1>
            <div className="ProductDisplay">
              <div className="ProductImageArea">
                <img src="https://i.ibb.co/dQcnxSr/will-breen-p-RW8jd-VMxt4-unsplash.jpg" />
              </div>
              <div className="ProductTextArea">
                <p>{groupbuy.description}</p>
                {groupbuy.listings && groupbuy.listings.length > 0 ? (
                  <>
                    <select
                      value={selectedListing}
                      onChange={(e) => setSelectedListing(e.target.value)}
                    >
                      <option value="">Select a product</option>
                      {groupbuy.listings.map((item, index) => (
                        <option key={index} value={item.listing_id}>
                          {item.product_name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={numberInput}
                      onChange={(e) => setNumberInput(e.target.value)}
                    ></input>
                  </>
                ) : (
                  <p>No listings available.</p>
                )}
                <div className="joinButtonDiv">
                  {accessCode ? (
                    <button
                      className="joinButton"
                      onClick={participationSubmit}
                    >
                      Join the buy!
                    </button>
                  ) : (
                    <p>Please log in to join the groupbuy!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default GroupbuyDetails;
