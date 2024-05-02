import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const GroupbuySummary = () => {
  const { accessCode, setAccessCode, userId, setUserId } =
    useContext(UserContext);

  const [summary, setSummary] = useState([]);
  const [total, setTotal] = useState([]);

  const host_url = import.meta.env.VITE_HOST_LINK;

  const { id } = useParams();

  const fetchSummary = async () => {
    try {
      const res = await fetch(host_url + `groupbuy/participants/${id}`, {
        headers: {
          Authorization: `Bearer ${accessCode}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching data:", error); // Log the actual error for debugging
    }
  };

  const fetchTotal = async () => {
    try {
      const res = await fetch(host_url + `groupbuy/total/participants/${id}`, {
        headers: {
          Authorization: `Bearer ${accessCode}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setTotal(data);
    } catch (error) {
      console.error("Error fetching data:", error); // Log the actual error for debugging
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchTotal();
  }, []);

  return (
    <>
      <Navbar accessCode={accessCode}></Navbar>
      <div className="Summary">
        <div className="SummaryHeader">
          <h1>Group buy summary</h1>
        </div>
        <h2>Joiner Summary</h2>
        <div>
          {summary.map((e) => {
            return (
              <div className="smallTotal">
                <div>{e.user_name}</div>
                <div>
                  {e.listing_name} x {e.amount}
                </div>
              </div>
            );
          })}
        </div>
        <div className="Total">
          <div>
            <h2>Total</h2>
          </div>
          {total.map((e) => {
            return (
              <div className="totalProduct">
                {e.product_name} : {e.total_amount}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GroupbuySummary;
