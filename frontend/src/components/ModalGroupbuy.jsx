import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register"; // Assuming you have a Register component
import GroupBuyForm from "./GroupBuyForm";

function ModalGroupbuy({ children, onClose, toggleRefetch }) {
  const [activeTab, setActiveTab] = useState("login"); // Default to login tab

  const handleClose = () => {
    onClose();
    toggleRefetch();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <GroupBuyForm onClose={onClose} />
        <button style={styles.closeButton} onClick={handleClose}>
          X
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    position: "relative",
    width: "80%",
    maxWidth: "500px",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default ModalGroupbuy;
