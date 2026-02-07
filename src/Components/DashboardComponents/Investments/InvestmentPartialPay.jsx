import React, { useContext, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { ToastContainer, toast } from 'react-toastify'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { NumericFormat } from 'react-number-format'

const InvestmentPartialPay = () => {
    const [banks, setBanks]= useState([])
    const [accounts, setAccounts]= useState([])
    const [input, setInput]= useState({})
    const [loading, setLoading]= useState(false)
const {credentials}= useContext(UserContext)
const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value;
    setInput({...input, [name]:value})
}

 const getAccounts = async () => {
    if (!input?.investmentBank) {
      return; 
    }
    setLoading(true)
    
    try {
      const resp = await axios(`Investment/placement-liquidation-investment-bank-selected-changed?BankCode=${input?.investmentBank}`, {
        headers: {
          Authorization: `Bearer ${credentials.token}`
        }
      });
      setLoading(false)
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

  useEffect(()=>{
    getAccounts()
  },[input?.investmentBank])
  
  const getBanks=()=>{
      axios('Investment/get-investment-bank-select', {headers:{
          Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>setBanks(resp.data.data))
    
  }
  useEffect(()=>{
      getBanks()
  },[])

  const onSubmit=(e)=>{
    e.preventDefault()
    const payload={
        investmentAccount: input.investmentAccount,
        operationType: input.operationType,
        placementAmount: Number(input.amount.replace(/,/g, "")),
        valueDate: input.valueDate
    }
    axios.post('Investment/placement-partial-pay', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true}))
    .catch(error=>{
      toast(error.response.data.message, {type:'error', autoClose:false})
      setLoading(false)
    })
  }
  return (
    <div className="bg-white py-4 px-3 rounded-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4
        style={{ fontSize: "16px", color: "#1d1d1d" }}
        className="active-selector">
        Partial Pay
      </h4>
    </div>
    <form onSubmit={onSubmit}>
      <div
        className="p-3"
        style={{ backgroundColor: "#F5F9FF", borderRadius: "15px 15px 0 0" }}
      >
        <div
          className=" d-flex align-items-center gap-2 title-link"
          style={{ width: "fit-content" }}
          onClick={() => navigate(-1)}
        >
          <BsArrowLeft />{" "}
          <span style={{ fontSize: "16px" }}>Partial Pay </span>
        </div>
      </div>
     
      <div
        className="px-3 pt-2 pb-4" style={{ borderInline: "1px solid #fafafa" }}>
        <div className="admin-task-forms my-3">
            <div className="d-flex flex-column gap-1">
                <label htmlFor="">Investment bank<sup className="text-danger">*</sup> </label>
                <select type="text" name='investmentBank' onChange={handleChange} required>
                <option value="">Select</option>
                {
                  banks.map(bank=>(
                    <option value={bank.bankCode} key={bank.bankCode}>{bank.bankName}</option>
                  ))
                }
                </select>
            </div>
            <div className="d-flex flex-column gap-1">
            <label htmlFor="">Investment account<sup className="text-danger">*</sup></label>
            <select type="text" name='investmentAccount' onChange={handleChange} required>
                <option value="">Select</option>
                {
                accounts.map(account=>(
                  <option value={account.accountNumber} key={account.accountNumber}>{account.accountNumber}</option>
                ))
              }
                </select>
            </div>
            <div className="d-flex flex-column gap-1">
            <label htmlFor="">Operation type<sup className="text-danger">*</sup></label>
            <select type="text" name='operationType' onChange={handleChange} required>
                <option value="">Select</option>
                <option value="1">Placement top up</option>
                <option value="2">Placement reduction</option>
                </select>
            </div>
            <div className="d-flex flex-column gap-1">
            <label htmlFor="amount">Top up/ Reduction amount<sup className="text-danger">*</sup></label>
            <NumericFormat thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} 
             name='amount' onChange={handleChange} required/>
            </div>
            <div className="d-flex flex-column gap-1">
            <label htmlFor="valueDate">Value date</label>
            <input type="date" name='valueDate' onChange={handleChange}
             placeholder={new Date().toLocaleDateString('en-US')} />
            </div>
      </div>
    </div>
    <div
          style={{ backgroundColor: "#f2f2f2", borderRadius: "0 0 10px 10px" }}
          className="d-flex justify-content-end gap-3 p-3">
          <button
            type="reset"
            className="btn btn-sm rounded-5"
            style={{ backgroundColor: "#f7f7f7" }}
          >
            Discard
          </button>
          <button type="submit" className="btn btn-md rounded-4 text-white" 
          style={{backgroundColor:'var(--custom-color)', fontSize:'14px'}}
          disabled={loading}>
            Proceed
          </button>
        </div>
      </form>
      <ToastContainer/>
    </div>
  )
}

export default InvestmentPartialPay
