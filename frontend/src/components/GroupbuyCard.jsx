import React from "react";
import styles from "./GroupbuyCard.module.css";
import { Link } from "react-router-dom";

const GroupbuyCard = (props) => {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.imageDiv}>
        <img src="https://i.ibb.co/dQcnxSr/will-breen-p-RW8jd-VMxt4-unsplash.jpg" />
      </div>
      <div className={styles.cardInfo}>
        <div className={styles.title}>{props.groupbuy.title}</div>
        <div className={styles.start_date}>{props.groupbuy.start_date}</div>
        <div className={styles.end_date}>{props.groupbuy.end_date}</div>
        <div className={styles.collectionPoint}>Collection Point: None</div>
        <div className={styles.user}>Hosted by {props.groupbuy.user_name}</div>
      </div>
      <div className="viewWrapper">
        <Link to={`/details/${props.groupbuy.groupbuy_id}`}>
          <button className={styles.viewButton}>View More</button>
        </Link>
      </div>
    </div>
  );
};

export default GroupbuyCard;
