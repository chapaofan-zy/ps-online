import React, { useRef, createRef, useState } from "react";
import "./App.less";
import "./global.less";
import Upimg from "./components/Upimg";
import "antd/dist/antd.css";
import Tag from "./components/Tag";
import Cav from './components/Cav'

function App() {
  const [vis, setvis] = useState(false)

  function vishandle() {
    setvis(!vis)
  }
  return (
    <div className="App">
      <button onClick={vishandle}>123123</button>
      <div className="up">
        <Upimg vishandle={vishandle}></Upimg>
      </div>
      <Tag srclist={["asd", "ttt", "yyh"]}></Tag>
      <Cav></Cav>
    </div>
  );
}

export default App;
