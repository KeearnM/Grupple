import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import styles from "./JoinedBuys.module.css";

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

      const res = await fetch(host_url + `groupbuy/${userId}`, requestOptions);
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
    console.log(joined);
  }, [joined]);

  return (
    <>
      <div className="sectionHeaders">
        Welcome back! Here are your joined group buys!
      </div>
      <div className={styles.JoinedBuy}>
        <div className={styles.cardWrap}>
          {joined.map((e) => {
            return (
              <div className={styles.card} key={e.groupbuy_id}>
                <div className={styles.imageWrap}>
                  <img
                    src="https://i.ibb.co/kBPKGNQ/alex-lvrs-m-Tw-Ge-Pu-RUE-unsplash.jpg"
                    alt="alex-lvrs-m-Tw-Ge-Pu-RUE-unsplash"
                    border="0"
                  />
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.title}>{e.title}</div>
                  <div>Hosted by: {e.host_name}</div>
                </div>
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
    </>
  );
};

export default JoinedBuys;
