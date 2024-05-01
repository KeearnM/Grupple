import React from "react";
import styles from "./GroupbuyCard.module.css";
import { Link } from "react-router-dom";

const GroupbuyCard = (props) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.imageDiv}></div>
      <div className={styles.title}>{props.groupbuy.title}</div>
      <div className={styles.start_date}>{props.groupbuy.start_date}</div>
      <div className={styles.end_date}>{props.groupbuy.end_date}</div>
      <div className={styles.collectionPoint}>Collection Point: None</div>
      <div className={styles.user}>Hosted by {props.groupbuy.user_name}</div>
      <div>
        <Link to={`/details/${props.groupbuy.groupbuy_id}`}>
          <button>View More</button>
        </Link>
      </div>
    </div>
  );
};

export default GroupbuyCard;
