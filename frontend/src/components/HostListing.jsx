import React from "react";
import styles from "./HostListing.module.css";

const HostListing = (props) => {
  return (
    <div className={styles.groupbuy}>
      <div className={styles.title}>{props.hostBuys.title}</div>
      <div>Start Date: {props.hostBuys.start_date}</div>
      <div>End Date: {props.hostBuys.end_date}</div>
      <button>Add Listings</button>
    </div>
  );
};

export default HostListing;
