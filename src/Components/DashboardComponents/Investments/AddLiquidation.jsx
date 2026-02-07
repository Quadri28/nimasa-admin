import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import { toast, ToastContainer } from 'react-toastify'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

const AddLiquidation = () => {
  const [banks, setBanks] = useState([]);
  const { credentials } = useContext(UserContext);
  const [accounts, setAccounts] = useState([]);
  const [input, setInput] = useState({});

  const getAccounts = async () => {
    if (!input?.investmentBank) {
      return; 
    }
    
    try {
      const resp = await axios(`Investment/placement-liquidation-investment-bank-selected-changed?BankCode=${input.investmentBank}`, {
        headers: {
          Authorization: `Bearer ${credentials.token}`
        }
      });
      setAccounts(resp.data.data.investmentBankAccountNumbers);
    } catch (error) {
      toast(error.response?.data?.message || 'Error fetching accounts', { type: 'error', autoClose: false });
    }
  };

  useEffect(() => {
    if (input?.investmentBank) {
      getAccounts();
    }
  }, [input?.investmentBank]);

  const getBanks = async () => {
    try {
      const resp = await axios('Investment/get-investment-bank-select', {
        headers: {
          Authorization: `Bearer ${credentials.token}`
        }
      });
      setBanks(resp.data.data);
    } catch (error) {
      toast(error.response?.data?.message, { type: 'error', autoClose: false });
    }
  };

  useEffect(() => {
    getBanks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const liquidateInvestment = async (e) => {
    e.preventDefault();
    const payload = {
      investmentAccount: input.investmentAccount,
      penalCharge: Number(input.penalCharge),
      valueDate: input.valueDate,
    };
    try {
      const resp = await axios.post('Investment/placement-liquidation', payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`
        }
      });
      toast(resp.data.message, { type: 'success', autoClose: 5000, pauseOnHover: true });
    } catch (error) {
      toast(error.response?.data?.message || 'Error liquidating investment', { type: 'error', autoClose: false });
    }
  };

  const navigate = useNavigate();
  
  return (
    <div className="bg-white p-4 rounded-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4
          style={{ fontSize: "16px", color: "#1d1d1d" }}
          className="active-selector">
          Liquidate Investment
        </h4>
      </div>
      <form onSubmit={liquidateInvestment}>
        <div className="p-3" style={{ backgroundColor: "#F5F9FF", borderRadius: "15px 15px 0 0" }}>
          <div
            className=" d-flex align-items-center gap-2 title-link"
            style={{ width: "fit-content" }}
            onClick={() => navigate(-1)}
          >
            <BsArrowLeft />{" "}
            <span style={{ fontSize: "16px" }}>Liquidate investment </span>
          </div>
        </div>
        
        <div className="px-3 pt-2 pb-4" style={{ borderInline: "1px solid #fafafa" }}>
          <div className="admin-task-forms my-3">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="">Investment bank</label>
              <select name='investmentBank' onChange={handleChange}>
                <option value="">Select</option>
                {banks.map(bank => (
                  <option value={bank.bankCode} key={bank.bankCode}>{bank.bankName}</option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="">Investment account</label>
              <select name='investmentAccount' onChange={handleChange}>
                <option value="">Select</option>
                {accounts.map(account => (
                  <option value={account.accountNumber} key={account.accountNumber}>{account.accountNumber}</option>
                ))}
              </select>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="">Penal charge</label>
              <input type="text" name='penalCharge' onChange={handleChange} required/>
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="valueDate">Value date</label>
              <input type="date" name='valueDate' onChange={handleChange}
               placeholder={new Date().toLocaleDateString('en-US')} />
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "#f2f2f2", borderRadius: "0 0 10px 10px" }} className="d-flex justify-content-end gap-3 p-3">
          <button type="reset" className="btn btn-sm rounded-5" style={{ backgroundColor: "#f7f7f7" }}>
            Discard
          </button>
          <button type="submit" className="btn btn-md rounded-4 text-white" 
          style={{backgroundColor:'var(--custom-color)', fontSize:'14px'}}>
            Proceed
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddLiquidation;
