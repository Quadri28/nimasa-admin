import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";

const ManageBank = () => {
  const [account, setAccount] = useState({});
  const [banks, setBanks] = useState([]);
  const { credentials } = useContext(UserContext);
  const getBankAccount = () => {
    axios("BankAccount/get-bank-account", {
      headers: {
        Authorization: `Bearer ${credentials?.token}`,
      },
    }).then((resp) => {
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
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAccount({ ...account, [name]: value });
  };

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
    axios
      .put("BankAccount/update-bank-account", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then(() => {
        toast("Cooperative bank account updated successfully", toastOptions);
        getBankAccount();
      });
  };

  return (
    <div className="card rounded-4 border-0 px-3 pt-4">
      <h3 style={{ fontSize: "16px" }}>Manage bank account</h3>
      <div style={{ border: "solid .5px #F2F2F2" }} className="my-3 rounded-4">
        <div className="display-container">
          <span
            style={{ fontSize: "14px", color: "#4d4d4d", fontWeight: "400" }}
          >
            Manage bank account
          </span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="global-admin-forms p-3">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="coopBankName">Bank Name:</label>
              <select
                type="text"
                name="cooperativeBankCode"
                className="py-3"
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
          </div>
          <div
            className="d-flex justify-content-end gap-3 py-4 px-2"
            style={{
              backgroundColor: "#FAFAFA",
              borderRadius: "0 0 10px 10px",
            }}
          >
            <button
              className="btn btn-md rounded-5 py-1 px-3"
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
              Update
            </button>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ManageBank;
