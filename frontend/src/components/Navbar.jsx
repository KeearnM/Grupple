import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.Navbar}>
      <div>Logo</div>
      <button>Login</button>
    </div>
  );
};

export default Navbar;
