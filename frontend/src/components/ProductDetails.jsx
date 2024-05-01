import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const ProductDetails = () => {
  const { id: groupbuyId } = useParams(); // Destructure the ID directly
  const location = useLocation();

  const [groupbuy, setGroupbuy] = useState(null); // Initialize with null

  const host_url = import.meta.env.VITE_HOST_LINK;

  console.log({ location });
  console.log(groupbuyId);

  const fetchData = async () => {
    try {
      const res = await fetch(host_url + `groupbuy/${groupbuyId}`);
      const data = await res.json();
      setGroupbuy(data);
      console.log(groupbuy); // This might still log the initial state
    } catch (error) {
      console.log("Error!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Log the updated state
    console.log(groupbuy);
  }, [groupbuy]); // Depend on groupbuy to log its updated value

  return (
    <div>
      {groupbuy ? (
        <>
          <h1>{groupbuy.title}</h1>
          <div>Image goes here</div>
          <div>{groupbuy.description}</div>
          <button onClick={() => console.log(groupbuy.listings)}>
            Log Groupbuy
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProductDetails;
