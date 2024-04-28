import React from "react";
import styles from "./GroupbuyCard.module.css";

const GroupbuyCard = (props) => {
  return (
    <div className={styles.cardWrapper}>
      <div>{props.groupbuy.title}</div>
      <div>{props.groupbuy.start_date}</div>
      <div>{props.groupbuy.end_date}</div>
      <div>Collection Point: None</div>
      <div>Hosted by {props.groupbuy.user_name}</div>
    </div>
  );
};

export default GroupbuyCard;
