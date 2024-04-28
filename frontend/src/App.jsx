import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import GroupbuyDisplay from "./components/GroupbuyDisplay";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GroupbuyDisplay></GroupbuyDisplay>
    </>
  );
}

export default App;
