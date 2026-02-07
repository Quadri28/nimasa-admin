import React, { useContext, useState } from "react";
import AddSingleShare from "./AddSingleShare";
import AddBulkShare from "./AddBulkShare";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";

const AddShares = () => {
  const [active, setActive] = useState("single");
const navigate = useNavigate()
const {credentials}= useContext(UserContext)
const getTemplate = () => {
  axios("ShareManagement/share-bulk-upload-template", {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${credentials.token}`,
    },
  }).then((blob) => {
    const url = window.URL.createObjectURL(new Blob([blob.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "BulkSharesTemplate.xlsx");
    link.click();
    window.URL.revokeObjectURL(url);
    setLoading(false);
  });
};

  const getComponent=()=>{
    if (active ==='single') {
        return <AddSingleShare/>
    }
    else{
        return <AddBulkShare/>
    }
  }

  return (
    <div className="bg-white px-3 rounded-3 pb-4">
      <div className="my-4 d-flex gap-3 flex-wrap justify-content-between">
       <div className="gap-3 d-flex" style={{cursor:'pointer'}}>
        <span
          className={
            active === "single" ? "active-selector text-capitalize" : null
          }
          onClick={()=>setActive('single')}
        >
          Add single share
        </span>
        <span
          className={
            active === "bulk" ? "active-selector text-capitalize" : null
          }
          onClick={()=>setActive('bulk')}
        >
          Add bulk shares
        </span>
        </div>
        { active === 'bulk' ?
          <button
            className="px-4 btn btn-md text-white rounded-5"
            style={{ backgroundColor: "var(--custom-color)", fontSize: "14px" }}
            onClick={()=>getTemplate()}
          >
            Download Excel Template
          </button>
          : null
}
      </div>
      <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
        <div
          className="pt-3 px-4 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0", }}
        >
          <p style={{ fontWeight: "500", fontSize: "16px" }}>
          <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> Add {active} Shares
          </p>
        </div>
        {
            getComponent()
        }
      </div>
    </div>
  );
};

export default AddShares;
