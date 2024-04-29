import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import GroupbuyDisplay from "./components/GroupbuyDisplay";
import "./index.css";
import Navbar from "./components/Navbar";
import Test from "./components/Test";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar></Navbar>
      <GroupbuyDisplay></GroupbuyDisplay>
      <Test></Test>
    </>
  );
}

export default App;
