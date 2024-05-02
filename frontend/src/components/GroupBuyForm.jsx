import React, { useContext, useState } from "react";
import styles from "./GroupBuyForm.module.css";
import { UserContext } from "../components/UserContext";

const GroupBuyForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);

  const host_url = import.meta.env.VITE_HOST_LINK;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const requestBody = {
      user_id: userId,
      title: title,
      description: description,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const response = await fetch(`${host_url}groupbuys`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessCode}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create groupbuy");
      }

      const data = await response.json();
      console.log("Groupbuy created successfully:", data);
    } catch (error) {
      console.error("Error creating groupbuy:", error);
    }
  };

  return (
    <div className={styles.InputWrap}>
      <h2>Enter new Groupbuy details below</h2>
      <form onSubmit={handleSubmit}>
        Enter Groupbuy Title:
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        Enter Groupbuy description:
        <div>
          <textarea
            cols="50"
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        Start Date:
        <div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          ></input>
        </div>
        End Date:
        <div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          ></input>
        </div>
        <div className={styles.submitWrap}>
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupBuyForm;
