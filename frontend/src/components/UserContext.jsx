import React, { createContext, useState } from "react";

const UserContext = createContext();

const UserInfo = ({ children }) => {
  const [accessCode, setAccessCode] = useState("");
  const [userId, setUserId] = useState("");
  const [admin, setAdmin] = useState("");

  return (
    <UserContext.Provider
      value={{ accessCode, setAccessCode, userId, setUserId, admin, setAdmin }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserInfo, UserContext };
