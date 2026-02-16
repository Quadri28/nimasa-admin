import React, { useContext, useEffect, useState } from 'react'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { ToastContainer, toast } from 'react-toastify'

const AccountInfo = ({details, handleChange}) => {
const [currencies, setCurrencies]= useState([])
const {credentials}= useContext(UserContext)


const getCurrencies=async ()=>{
  await axios('Common/get-currencies').then(resp=>setCurrencies(resp.data))
 }

 useEffect(()=>{
getCurrencies()
 }, [])
   
    const updateAccountInfo=(e)=>{
      e.preventDefault()
    const payload={
      bankCode: details.bankCode,
      bankName: details.bankName,
      bankFax: details.bankFax,
      address: details.address,
      phone: details.phone,
      email: details.email,
      slogan: details.slogan,
      pAndLAccount: details.pAndLAccount,
      priorpandlacct: details.priorpandlacct,
      lastFinancialYear: details.lastFinancialYear,
      nextFinancialYear: details.nextFinancialYear,
      state: details.state,
      smsreq: details.smsreq,
      multiacct: details.multiacct,
      acctOpenSms: details.acctOpenSms,
      regFee: Number(details.regFee),
      regFeeMode: Number(details.regFeeMode),
      regFeeAccount: details.regFeeAccount,
      logoPathId: details.logoPathId,
      documentPathID: details.documentPathID,
      cooperativeType: Number(details.cooperativeType),
      cooperativeCategory: details.cooperativeCategory,
      currencyCode: details.currencyCode,
      incomeAccount: details.incomeAccount,
      cashAccount: details.cashAccount,
      payableAccount: details.payableAccount,
      expenseAccount: details.expenseAccount
    }
    const toastOptions ={
      pauseOnHover: true,
      type: 'success',
      autoClose: 5000
    }
    axios.put('SetUp/update-general-setup', payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }})
    .then((resp)=>toast('Account information updated successfully', toastOptions))
    }
  return (
    <>
       <div style={{border:'solid .5px #F2F2F2'}} className='my-3 rounded-4'>
     <div className="display-container">
        <span style={{fontSize:'14px', color:'#4d4d4d', fontWeight:'400'}}>Account Information</span>
     </div>
     <form onSubmit={updateAccountInfo}>
        <div className="global-admin-forms p-3">
        <div className="d-flex flex-column gap-2">
            <label htmlFor="currencyCode" style={{fontWeight: '500'}}>
              Currency:
            </label>
            <select name="currencyCode" id="currencyCode" as='select'
             value={details?.currencyCode} onChange={handleChange}> 
            <option value="" disabled>select</option>
            {
              currencies.map((currency, i)=>(
                <option value={currency.countryCode} key={i}>{currency.currencyName}</option>
              ))
            }
            </select>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="priorpandlacct" style={{fontWeight: '500'}}>
              End of the year P & L account:
            </label>
            <input name="priorpandlacct" id="state"
            value={details?.priorpandlacct} onChange={handleChange}
            />
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="pAndLAccount" style={{fontWeight: '500'}}>
              P & L account:
            </label>
            <input name="pAndLAccount" id="pAndLAccount"
             value={details?.pAndLAccount} onChange={handleChange}/>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="incomeAccount" style={{fontWeight: '500'}}>
              Income account:
            </label>
            <input name="incomeAccount" id="incomeAccount" 
            value={details?.incomeAccount} onChange={handleChange}/>
          </div>
          <div className="d-flex flex-column gap-2">
           <label htmlFor="payableAccount" style={{fontWeight: '500'}}>Payable Account</label>
            <input name="payableAccount" id="payableAccount" 
            value={details?.payableAccount} onChange={handleChange}/>
          </div>
          <div className="d-flex flex-column gap-2">
              <label style={{fontWeight: '500'}}>Next financial year:</label>
              <input
                name="nextFinancialYear"
                id="nextFinancialYear"
                type="date"
                onChange={handleChange}
              /> 
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="regFeeAccount" style={{fontWeight: '500'}}>
              Registration fee account:
            </label>
            <input name="regFeeAccount" id="regFeeAccount" 
            value={details?.regFeeAccount} onChange={handleChange} />
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="cashAccount" style={{fontWeight: '500'}}>
              Cash account:
            </label>
            <input name="cashAccount" id="cashAccount" 
            value={details?.cashAccount} onChange={handleChange}/>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="lastFinancialYear" style={{fontWeight: '500'}}>
              Last financial year: </label>
            <input name="lastFinancialYear" type="date"
             onChange={handleChange}/>
          </div>
          <div className="d-flex flex-column gap-2">
            <label htmlFor="expenseAccount" style={{fontWeight: '500'}}>
              Expense account:
            </label>
            <input name="expenseAccount" id="expenseAccount" 
            value={details?.expenseAccount} onChange={handleChange}/>
          </div>
        </div>
        <div
          className="d-flex justify-content-end gap-3 mt-3 p-3"
          style={{ backgroundColor: "#FAFAFA" }}
        >
          <button className="btn btn-md" 
          style={{backgroundColor:'#ddd', borderRadius:'1.5rem', fontSize:'14px'}} type="reset">
            Discard
          </button>
          <button
            className="btn btn-md"
            style={{
              backgroundColor: "var(--custom-color)",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "1.5rem",
              fontSize:'14px'
            }}
            type="submit"
          >
            Update
          </button>
        </div>
     </form>
     </div>
     <ToastContainer/>
    </>
  )
}

export default AccountInfo
