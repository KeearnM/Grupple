import React from "react";
import styles from "./Navbar.module.css";
import logo from "../assets/Logo.png";

const Navbar = () => {
  return (
    <div className={styles.Navbar}>
      <img src={logo} className={styles.logoImg}></img>
      <div className={styles.leftDivWrapper}>
        <button className={styles.loginButton}>Login</button>
      </div>
    </div>
  );
};

export default Navbar;
