import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { UserContext } from "../components/UserContext";

const Profile = () => {
  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);

  const [joinedBuys, setJoinedBuys] = useState([]);

  const host_url = import.meta.env.VITE_HOST_LINK;

  const fetchData = async () => {
    try {
      // Adjust the URL to match the provided API endpoint
      const res = await fetch(`${host_url}participations/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessCode}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        // Check if the response status is not successful
        throw new Error("Failed to fetch data");
      }

      const data = await res.json();
      setJoinedBuys(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message); // Set the error state
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Navbar accessCode={accessCode}></Navbar>
      <h1>Your joined groupbuys</h1>
      <div>
        {joinedBuys.map((e) => {
          return (
            <div>
              <div>{e.groupbuy_title}</div>
              <div>{e.product_name}</div>
              <div>{e.amount}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
