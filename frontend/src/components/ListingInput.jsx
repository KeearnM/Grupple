import React, { useContext, useState } from "react";
import { UserContext } from "../components/UserContext";

const ListingInput = (props) => {
  const [listing, setListing] = useState("");
  const host_url = import.meta.env.VITE_HOST_LINK;

  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);

  const handleInputChange = (event) => {
    setListing(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${host_url}/listings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessCode}`,
        },
        body: JSON.stringify({
          product_name: listing,
          groupbuy_id: props.groupbuy_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={listing}
        onChange={handleInputChange}
        placeholder="Enter listing"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ListingInput;
