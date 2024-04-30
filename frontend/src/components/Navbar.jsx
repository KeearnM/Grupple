import React from "react";
import styles from "./Navbar.module.css";
import logo from "../assets/Logo.png";

const Navbar = (props) => {
  return (
    <div className={styles.Navbar}>
      <img src={logo} className={styles.logoImg}></img>
      <div className={styles.leftDivWrapper}>
        {props.accessCode ? (
          <div>Welcome, User!</div> // Elements to show when access code is present
        ) : (
          <button className={styles.loginButton}>Login</button> // Elements to show when access code is not present
        )}
      </div>
    </div>
  );
};

export default Navbar;
