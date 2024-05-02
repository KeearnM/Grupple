import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import styles from "./HostListing.module.css";
//@ts-ignore
import ListingInput from "./ListingInput";
import ModalGroupbuy from "./ModalGroupbuy";
import { Link } from "react-router-dom";

const HostListing = (props) => {
  const [listings, setListings] = useState({ product_names: [] });
  const [refetch, setRefetch] = useState(false);
  const [showListingInput, setShowListingInput] = useState(false);

  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);

  const host_url = import.meta.env.VITE_HOST_LINK;

  const fetchData = async () => {
    try {
      const res = await fetch(
        host_url + `/listings/${props.hostBuys.groupbuy_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessCode}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setListings(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error); // Log the actual error for debugging
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [refetch]);

  // Function to update listings
  const toggleRefetch = () => {
    setRefetch(!refetch);
  };

  const toggleListingInput = () => {
    setShowListingInput(!showListingInput);
  };

  return (
    <div className={styles.groupbuy}>
      <div className={styles.title}>{props.hostBuys.title}</div>
      <div>Start Date: {props.hostBuys.start_date}</div>
      <div>End Date: {props.hostBuys.end_date}</div>
      <div className={styles.subHeader}>Listings</div>
      <div className={styles.listingWrap}>
        {listings.product_names.map((e) => {
          return <div className={styles.listing}>{e}</div>;
        })}
      </div>
      <button className={styles.detailButton} onClick={toggleListingInput}>
        Add Listings
      </button>
      <Link to={`/summary/${props.hostBuys.groupbuy_id}`}>
        <button className={styles.detailButton}>More Groupbuy Details</button>
      </Link>
      {showListingInput && ( // Conditionally render ListingInput
        <ListingInput
          groupbuy_id={props.hostBuys.groupbuy_id}
          toggleRefetch={toggleRefetch}
        />
      )}
    </div>
  );
};

export default HostListing;
