import React, { useEffect, useState } from "react";
import "./css/tag.less";

export default function Tag(props) {
  const [src, setsrc] = useState([]);
  useEffect(() => {
    let arr = [];
    props.srclist.map((e, i) => {
      arr.push(new Node(e, i));
    });
    setsrc(arr);
  }, []);
  return (
    <div className="tagbg">
      {src.map((e, i) => {
        return (
          <div style={e.tagstyle} key={i} onClick={e.click.bind(e, e)}>
            {e.src}
          </div>
        );
      })}
    </div>
  )
}

class Node {
  constructor(src, num) {
    this.tagstyle = {
      width: "30px",
      height: "30px",
      background: "red",
      color: "white",
      margin: "10px",
    };
    this.src = src;
    this.num = num;
    this.click(this);
  }
  click(e) {
    console.log(e.src);
  }
}
