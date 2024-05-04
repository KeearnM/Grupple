import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";

const Login = (props) => {
  const { accessCode, setAccessCode, userId, setUserId, admin, setAdmin } =
    useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const host_url = import.meta.env.VITE_HOST_LINK;

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const response = await fetch(host_url + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || "Network response was not ok";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAccessCode(data.access_token);
      setUserId(data.user);
      setAdmin(data.admin);
      props.onClose();
    } catch (error) {
      window.prompt("Error", error.message);
    }
  };

  return (
    <div>
      <h3>Login</h3>
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

export default Login;
