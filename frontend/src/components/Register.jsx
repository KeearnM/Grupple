import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";

const Register = () => {
  const { setUserId } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const host_url = import.meta.env.VITE_HOST_LINK;

  const handleSubmit = async () => {
    try {
      const response = await fetch(host_url + "register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUserId(data.user);
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  return (
    <div>
      Register
      <div>
        Email{" "}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        Password{" "}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Register;
