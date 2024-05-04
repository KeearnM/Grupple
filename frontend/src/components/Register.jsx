import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import styles from "./Register.module.css";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const host_url = import.meta.env.VITE_HOST_LINK;

  const handleSubmit = async () => {
    try {
      const response = await fetch(host_url + "user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Network response was not ok";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      props.onClose();
    } catch (error) {
      // Use window.prompt to display the error message
      window.prompt("Error", error.message);
    }
  };

  return (
    <div className={styles.Register}>
      <h3>Register</h3>
      <div className={styles.subRegister}>
        <div>
          {" "}
          Name{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          {" "}
          Email{"    "}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          {" "}
          Password{" "}
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        <div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
