import React, { useEffect, useState } from "react";
import GroupbuyCard from "./GroupbuyCard";

const GroupbuyDisplay = () => {
  const [groupbuys, setGroupbuys] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/groupbuys");
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
    <div>
      {groupbuys.map((data, index) => (
        <div key={index}>
          <GroupbuyCard groupbuy={data}></GroupbuyCard>
        </div>
      ))}
    </div>
  );
};

export default GroupbuyDisplay;
