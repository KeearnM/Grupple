import React, { useContext } from "react";
import styles from "./Navbar.module.css";
import logo from "../assets/Logo.png";
import { UserContext } from "./UserContext";
import { Link } from "react-router-dom";

const Navbar = (props) => {
  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);

  return (
    <div className={styles.Navbar}>
      <Link to={`/`}>
        <img src={logo} className={styles.logoImg}></img>
      </Link>
      <div className={styles.leftDivWrapper}>
        {props.accessCode ? (
          <>
            <Link to={`/host/${userId}`}>
              <div className={styles.NavItem}>Host Page</div>
            </Link>
            {/* <div className={styles.NavItem}>Host Page</div> */}
            <div className={styles.NavItem}>Profile</div>
            <button className={styles.Button} onClick={() => setAccessCode("")}>
              Sign Out
            </button>
          </>
        ) : (
          // Elements to show when access code is present
          <button
            className={styles.loginButton}
            onClick={() => props.setModalOpen(true)}
          >
            Login
          </button> // Elements to show when access code is not present
        )}
      </div>
    </div>
  );
};

export default Navbar;
