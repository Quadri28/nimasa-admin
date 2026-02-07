import React,{useState} from "react";
import "./AdminTasks.css";

import { Outlet } from "react-router-dom";
import Scroller from "./ConfigurationsSubComponents/Scroller";

const AdminTasks = () => {
  return (
    <div>
      <p className="page-title">Admin Tasks </p>
      <Scroller/>
      <div style={{overflow:'hidden'}} className="mt-4">
      <Outlet />
      </div>
    </div>
  );
};

export default AdminTasks;
