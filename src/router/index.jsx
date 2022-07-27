import { Routes, Route, HashRouter as Router } from "react-router-dom";
import React, { lazy } from "react";
import App from "../App";

let routeArr = [
  {
    path: "/",
    component: App,
    children: [
      { path: "/home", component: lazy(() => import("../pages/Home")) },
      { path: "/edit", component: lazy(() => import("../pages/Edit")) },
    ],
  },
];
const MyRouter = () => (
  <Router>
      <Routes>
        {/* {
          routeArr.map((item, index) => (
            <Route key={index} path={item.path} element={<item.component />}></Route>
          ))
        } */}
        <Route path="/" element={<App/>}></Route>
      </Routes>
  </Router>
);

export default MyRouter;