import React, { useEffect, useState } from "react";
import GroupbuyCard from "./GroupbuyCard";
import styles from "./GroupbuyDisplay.module.css";

const GroupbuyDisplay = () => {
  const [groupbuys, setGroupbuys] = useState([]);

  const host_url = import.meta.env.VITE_HOST_LINK;

  const fetchData = async () => {
    try {
      const res = await fetch(host_url + "groupbuys");
      const data = await res.json();
      setGroupbuys(data);
      console.log(groupbuys);
    } catch (error) {
      console.log("Error!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.cardDisplay}>
      {groupbuys.map((data, index) => (
        <div key={index} className={styles.cardWrap}>
          <GroupbuyCard groupbuy={data}></GroupbuyCard>
        </div>
      ))}
    </div>
  );
};

export default GroupbuyDisplay;
