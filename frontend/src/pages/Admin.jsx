import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { UserContext } from "../components/UserContext";

const Admin = () => {
  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);
  const [allUser, setAllUser] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const host_url = import.meta.env.VITE_HOST_LINK;

  const getUsers = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessCode}`,
        },
      };

      const res = await fetch(host_url + `allusers`, requestOptions);
      const data = await res.json();
      setAllUser(data);
    } catch (error) {
      console.log("Error!", error);
    }
  };

  const adminToggle = async (id) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessCode}`,
        },
        body: JSON.stringify({ user_id: userId }),
      };

      const res = await fetch(host_url + `/toggle-admin/${id}`, requestOptions);
      const data = await res.json();

      if (Array.isArray(data)) {
        toggleRefetch();
      } else {
        console.error("Error: Expected array response, got", data);
        toggleRefetch();
      }
    } catch (error) {
      console.log("Error!", error);
      toggleRefetch();
    }
  };

  const delUser = async (id) => {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessCode}`,
        },
        body: JSON.stringify({ user_id: userId }),
      };

      const res = await fetch(host_url + `/users/${id}`, requestOptions);
      const data = await res.json();

      if (Array.isArray(data)) {
        toggleRefetch();
      } else {
        console.error("Error: Expected array response, got", data);
        toggleRefetch();
      }
    } catch (error) {
      console.log("Error!", error);
      toggleRefetch();
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const toggleRefetch = () => {
    setRefetch(!refetch);
  };

  useEffect(() => {
    getUsers();
  }, [refetch]);

  return (
    <>
      <Navbar accessCode={accessCode}></Navbar>
      <div className="AdminDiv">
        <h1>Admin Dashboard</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {allUser?.map((user) => (
              <tr key={user.id}>
                <td>{user.user_id}</td>
                <td>{user.name}</td>
                <td>{user.admin ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => adminToggle(user.user_id)}>
                    Admin Toggle
                  </button>
                </td>
                <td>
                  <button onClick={() => delUser(user.user_id)}>
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Admin;
