import React, { createContext, useState } from "react";

const UserContext = createContext();

const UserInfo = ({ children }) => {
  const [accessCode, setAccessCode] = useState("");
  const [userId, setUserId] = useState("");

  return (
    <UserContext.Provider
      value={{ accessCode, setAccessCode, userId, setUserId }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserInfo, UserContext };
