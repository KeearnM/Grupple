import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";

const JoinedBuys = () => {
  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);

  const host_url = import.meta.env.VITE_HOST_LINK;

  const [joined, setJoined] = useState([]);

  const fetchData = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessCode}`,
        },
      };

      const res = await fetch(host_url + `groupbuys/${userId}`, requestOptions);
      const data = await res.json();
      setJoined(data);
      console.log(joined); // This might still log the initial state
    } catch (error) {
      console.log("Error!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(joined); // Log the updated state here
  }, [joined]); // This useEffect will run whenever `joined` changes

  return (
    <div>
      <div>Welcome back! Here are your joined group buys!</div>
      <div>
        {joined.map((e) => {
          return (
            <div>
              <div>{e.title}</div>
              <div>Hosted by: {e.host_name}</div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          console.log(joined);
        }}
      ></button>
    </div>
  );
};

export default JoinedBuys;
