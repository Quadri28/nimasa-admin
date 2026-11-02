import React, { useContext, useEffect, useMemo, useState } from "react";
import { data } from "./MOCK_DATA";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { Formik, Form } from "formik";
import "./Table.css";
import GlobalFilter from "./GlobalFilter";
import { CiEdit } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import ManageBankAcctForm from "./ManageBankAcctForm";
import * as Yup from "yup";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { ToastContainer, toast } from "react-toastify";

const ManageBankAccount = () => {
  const [banks, setBanks] = useState([]);
  const [account, setAccount] = useState({
    coopName: "",
    cooperativeBankCode: "",
    cooperativeAccontNumber: "",
    cooprativeAccountName: "",
    subAccountCode: "",
    subAccountId: "",
  });
  const { credentials } = useContext(UserContext);
  const getBankAccount = () => {
    axios("BankAccount/get-bank-account").then((resp) => {
      setAccount(resp.data.data);
    });
  };

  const getBanks = () => {
    axios("Common/get-banks").then((resp) => setBanks(resp?.data));
  };

  useEffect(() => {
    getBankAccount();
    getBanks();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      cooperativeBankCode: account.cooperativeBankCode,
      cooperativeAccontNumber: account.cooperativeAccontNumber,
      coopAccountName: account.cooprativeAccountName,
    };
    const toastOptions = {
      autoClose: 5000,
      pauseOnHover: true,
      type: "success",
    };
    axios.post("BankAccount/update-bank-account", payload).then(() => {
      toast("Cooperative bank account updated successfully", toastOptions);
      getBankAccount();
    });
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAccount({ ...account, [name]: value });
  };
const bank = banks.find(
  (bank) => bank.bankCode === account?.cooperativeBankCode
);
  return (
    <div className="card my-4 p-3 rounded-4 border-0">
      <div className="mb-3">
        <span className="active-selector">Manage bank account</span>
      </div>
      <div className="admin-task-forms px-3">

      <div
          className="bg-white"
          style={{
            borderRadius: "15px",
            border: "solid .5px #fafafa",
            borderBlock: "0",
          }}
        >
          <div
            style={{
              backgroundColor: "#E6ECF4",
              borderRadius: "15px 15px 0 0",
            }}
            className="p-3"
          >
            <h5 style={{ fontSize: "16px", color: "#333" }}>Manage Bank Account</h5>
          </div>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 p-3">
          <div className="inputs-container d-flex flex-column gap-1">
            <label htmlFor="coopBankName">Bank Name:</label>
            <select
              type="text"
              name="cooperativeBankCode"
              style={{ paddingBlock: "1.2rem" }}
              onChange={handleChange}
              value={account?.cooperativeBankCode}
            >
              <option value="" disabled>
                Select
              </option>
              {banks.map((bank) => (
                <option value={bank.bankCode} key={bank.bankCode}>
                  {bank.bankName}
                </option>
              ))}
            </select>
          </div>
          <div className="inputs-container d-flex flex-column gap-1">
            <label htmlFor="coopAcctNo">Account Number:</label>
            <input
              type="text"
              name="cooperativeAccontNumber"
              className="py-3"
              onChange={handleChange}
              value={account?.cooperativeAccontNumber}
            />
          </div>
          <div className="inputs-container row g-1 gap-1">
            <label htmlFor="cooperativeAccountName">Account Name:</label>
            <input
              type="text"
              name="cooprativeAccountName"
              className="py-3"
              onChange={handleChange}
              value={account?.cooprativeAccountName}
            />
          </div>
          <div className="d-flex mt-2 gap-3 justify-content-center">
            <button type="submit" className="border-0 member btn-md">
              Update
            </button>
          </div>
          <ToastContainer />
        </form>
          </div>
        <div>
          <div
            className="d-flex flex-column gap-2 pb-3 px-0"
            style={{
              boxShadow: "3px 3px 3px 3px #ddd",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <div
              style={{
                backgroundColor: "#EDF4FF",
                paddingTop: "10px",
                paddingInline: "15px",
                borderRadius: "10px 10px 0 0",
              }}
            >
              <p>Bank Account Details</p>
            </div>
            <div className="d-flex flex-column px-3 gap-2">
              <div className="d-flex gap-3 discourse">
                <span>Account Name:</span>
                <p>{account?.cooprativeAccountName}</p>
              </div>
            </div>
            <div className="d-flex flex-column px-3 gap-2">
              <div className="d-flex gap-3 discourse">
                <span>Account Name:</span>
                <p>{account?.cooperativeAccontNumber}</p>
              </div>
            </div>
             <div className="d-flex flex-column px-3 gap-2">
              <div className="d-flex gap-3 discourse">
                <span>Bank Name:</span>
                <p>{bank?.bankName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBankAccount;
