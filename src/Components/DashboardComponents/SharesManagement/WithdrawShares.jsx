import React, { useContext, useEffect, useState } from "react";
import { Form, Formik, ErrorMessage, Field } from "formik";
import "./SharesManagement.css";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Combobox } from "react-widgets";

const WithdrawShares = () => {
  const [shareTypes, setShareTypes] = useState([]);
  const { credentials } = useContext(UserContext);
  const [members, setMembers] = useState([]);
  const [value, setValue]= useState('')
  const [shareType, setShareType]= useState('')
  const [details, setDetails]= useState({})
  const [accounts, setAccounts]= useState([])
  const [account, setAccount]= useState('')
  
const getAccounts=()=>{
  axios("Acounting/general-ledger-customer-enquiry?SearchOption=2", {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>setAccounts(resp.data.data))
}
  const getMembers = () => {
    axios("MemberManagement/get-member-reg-detail-slim", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setMembers(resp.data.data));
  };
  const getSharesTypes = () => {
    axios(`ShareManagement/member-purchased-shares?memberUniqueId=${value}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setShareTypes(resp.data.data));
  };
  useEffect(() => {
    getMembers();
    getAccounts()
  }, []);

  useEffect(()=>{
    getSharesTypes();
  }, [value])

  const getDetails = () => {
    axios(`ShareManagement/member-purchased-share-detail?MemberUniqueId=${value}&ShareId=${shareType}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setDetails(resp.data.data));
  };

  useEffect(()=>{
getDetails()
  },[shareType, value])

  

  const onSubmit = (e) => {
    e.preventDefault()
    const payload = {
      debitAccountNumber: account,
      description: 'Shares withdrawal',
      shareId: shareType,
    };
    axios
      .post("ShareManagement/withdraw-share", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
        setTimeout(() => {
          navigate(-1)
        }, 5000);
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };

  const navigate = useNavigate();
  return (
   
      <form className="px-3 pb-4" onSubmit={onSubmit}>
        <div style={{ border: "solid 1px #fafafa" }} className="rounded-4 mt-4">
          <div
            className="pt-3 px-4 justify-content-between align-items-center d-flex"
            style={{
              backgroundColor: "#f4fAfd",
              borderRadius: "15px 15px 0 0",
            }}
          >
            <p style={{ fontWeight: "500", fontSize: "16px" }}>
              <BsArrowLeft
                onClick={() => navigate(-1)}
                style={{ cursor: "pointer" }}
              />
              Withdraw Shares
            </p>
          </div>
          <div className="d-flex flex-column gap-2 px-3 select-member-container mt-3">
            <label htmlFor="member">Search Member</label>
            <Combobox
        data={members}
        textField="fullname"
        dataKey="customerId" 
        onChange={(newValue) => setValue(newValue.uniqueID)}
        placeholder="Select a member"
      />
          </div>
          <div className="px-4 admin-task-forms pb-3 bg-white">
            <div className="row g-2 ">
              <label htmlFor="shareType" style={{ fontWeight: "500" }}>
                Select Share Type
              </label>
              <select
                name="shareType"
                placeholder="Enter shares code"
                onChange={(e)=>setShareType(e.target.value)}
              >
                <option value="">Select</option>
                {shareTypes.map((type) => (
                  <option value={type.id} key={type.id}>
                    {type.shareProductName}
                  </option>
                ))}
              </select>
            </div>
            <div className="row g-2">
              <label htmlFor="purchasingAmount" style={{ fontWeight: "500" }}>
                Purchasing Unit
              </label>
              <input
              disabled
                name="purchasedSharedUnit"
                value={details?.purchasedSharedUnit}
                placeholder="Enter purchasing amount"
              />
            </div>
            <div className="row g-2 ">
              <label htmlFor="date" style={{ fontWeight: "500" }}>
                Purchased share amount
              </label>
              <input disabled name="purchasedSharedAmount" value={details?.totalShareAmount} />
            </div>
            <div className="row g-2 ">
              <label htmlFor="currentTotalShareAmount" style={{ fontWeight: "500" }}>
               Current share amount
              </label>
              <input
                name="currentTotalShareAmount"
                value={details?.currentTotalShareAmount}
                disabled
              />
            </div>
            <div className="d-flex flex-column g-2 ">
              <label htmlFor="account" style={{ fontWeight: "500" }}>
                Select Account Number<sup className="text-danger">*</sup>
              </label>
              <select name="account" required onChange={(e)=>setAccount(e.target.value)}>
                <option value="">Select</option>
                {
                  accounts.map((account, i)=>(
                    <option value={account.accountNumber} key={i}>
                    {`${account.acctName}  >> ${account.accountNumber} >> ${account.product}`}
                  </option>
                  ))
                }
                </select>
            </div>
          </div>
          <div
            className="d-flex justify-content-end gap-3 py-4 px-2"
            style={{
              backgroundColor: "#FAFAFA",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <button
              className="btn btn-md rounded-5 py-2 px-3"
              style={{ backgroundColor: "#F7F7F7", fontSize: "14px" }}
              type="reset"
            >
              Discard
            </button>
            <button
              className="btn btn-md text-white rounded-5"
              style={{ backgroundColor: "var(--custom-color)", fontSize: "14px" }}
              type="submit"
            >
              Withdraw Share
            </button>
            <ToastContainer />
          </div>
        </div>
      </form>
  );
};

export default WithdrawShares;
