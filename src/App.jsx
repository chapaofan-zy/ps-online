import React, { useState, useRef } from "react";
import "./App.less";
import "./global.less";
import Upimg from "./components/Upimg";
import "antd/dist/antd.css";
import Tag from "./components/Tag";
import Cav from './components/Cav'
import Draggable from 'react-draggable'


function App() {
  const [vis, setvis] = useState(false)
  const [img, setimg] = useState({})
  const [url, seturl] = useState({})

  function vishandle() {
    setvis(!vis)
  }

  function toCav(e) {
    setimg(e)
    seturl(e)
  }

  return (
      <div className="App">
        {/* <button onClick={vishandle}>123123</button> */}
        <div className="up">
          <Upimg vishandle={vishandle} toCav={toCav}></Upimg>
        </div>
        {/* <Tag srclist={["asd", "ttt", "yyh"]}></Tag> */}
        {vis && <Cav img={img} url={url} vis={true}></Cav>}
      </div>
    
  );
}

export default App;
