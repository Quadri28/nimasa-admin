import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../AuthContext';
import axios from '../../axios';
import { toast, ToastContainer } from 'react-toastify';

const CooperativeInfo = ({details, handleChange}) => {
    const [types, setTypes] = useState([]);
    const [states, setStates] = useState([]);
    const {credentials} = useContext(UserContext);

 
  const getStates=async ()=>{
   await axios('Common/get-states-by-countryId?countryCode=001').then(resp=>setStates(resp.data))
  }
  const getCooperativeTypes =async () => {
    await axios("Common/cooperative-types")
    .then((resp) => {
      setTypes(resp.data)
    });
  };

  useEffect(() => {
    getCooperativeTypes();
    getStates()
  }, []);
    const updateCooperativeInfo=(e)=>{
        e.preventDefault()
        const payload = {
          bankCode: details?.bankCode,
          bankName: details?.bankName,
          bankFax: details?.bankFax,
          address: details?.address,
          phone: details?.phone,
          email: details?.email,
          slogan: details?.slogan,
          pAndLAccount: details?.pAndLAccount,
          priorpandlacct: details?.priorpandlacct,
          lastFinancialYear: details?.lastFinancialYear,
          nextFinancialYear: details?.nextFinancialYear,
          state: details?.state,
          smsreq: details?.smsreq,
          multiacct: details?.multiacct,
          acctOpenSms: details?.acctOpenSms,
          regFee: Number(details?.regFee),
          regFeeMode: Number(details?.regFeeMode),
          regFeeAccount: details?.regFeeAccount,
          logoPathId: details?.logoPathId,
          documentPathID: details?.documentPathID,
          cooperativeType: Number(details?.cooperativeType),
          cooperativeCategory: details?.cooperativeCategory,
          currencyCode: details?.currencyCode,
          incomeAccount: details?.incomeAccount,
          cashAccount: details?.cashAccount,
          payableAccount: details?.payableAccount,
          expenseAccount: details?.expenseAccount,
        };
        const toastOptions = {
          pauseOnHover: true,
          type: "success",
          autoClose: 5000,
        };
        axios
          .post("SetUp/update-general-setup", payload, {
            headers: {Authorization: `Bearer ${credentials.token}`},
          })
          .then(() =>{
            toast("Cooperative information updated successfully", toastOptions)
    });
    }
  return (
    <>
      <div style={{border:'solid .5px #F2F2F2'}} className='my-3 rounded-4'>
     <div className="display-container">
        <span style={{fontSize:'14px', color:'#4d4d4d', fontWeight:'400'}}>Cooperative Information</span>
     </div>
     <form onSubmit={updateCooperativeInfo}>
     <div className="global-admin-forms p-3">
        <div className="d-flex flex-column gap-1">
            <label htmlFor="">Cooperative name<sup className="text-danger">*</sup></label>
            <input type="text" name='bankName' value={details?.bankName} onChange={handleChange}/>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="state">Head office state:<sup className="text-danger">*</sup></label>
            <select type="text" name='state' value={details?.state} onChange={handleChange}>
              <option value="">Select state</option>
              {
                states.map(state=>(
                  <option value={state.stateCode} key={state.stateCode}>{state.stateName}</option>
                ))
              }
              </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="">Cooperative slogan<sup className="text-danger">*</sup></label>
            <input type="text" name='slogan' value={details?.slogan} onChange={handleChange}/>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="email">Email address<sup className="text-danger">*</sup></label>
            <input type="text" name='email' value={details?.email} onChange={handleChange}/>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="cooperativeType">Type of cooperative<sup className="text-danger">*</sup></label>
            <select type="text" name='cooperativeType' value={details?.cooperativeType} onChange={handleChange}>
            <option value="">Select</option>
            {
              types.map(type=>(
                <option value={type.id} key={type.id}>{type.name}</option>
              ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="phone">Contact number<sup className="text-danger">*</sup></label>
            <input type="text" name='phone' value={details?.phone} onChange={handleChange}/>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="registrationNumber">Registration number<sup className="text-danger">*</sup></label>
            <input type="text" name='registrationNumber' value={details?.registrationNumber} onChange={handleChange}/>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="regFee">Registration fee<sup className="text-danger">*</sup></label>
            <input type="text" name='regFee' value={details?.regFee} onChange={handleChange}/>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="address">Address<sup className="text-danger">*</sup></label>
            <input type="text" name='address' value={details?.address} onChange={handleChange}/>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="">Cooperative category<sup className="text-danger">*</sup></label>
            <select
              name="cooperativeCategory"
              onChange={handleChange}
              value={details?.cooperativeCategory}
              id="cooperativeCategory"
            >
              <option value={1}>Department</option>
              <option value={2}>Community</option>
            </select>
        </div>
        <div>
            <label htmlFor="">Reg. fee collection mode</label>
        <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-1">
                <input type="radio" value={1} name='regFeeMode' 
                checked={details.regFeeMode === 1 ? details.regFeeMode: null} onChange={handleChange}/>
                <label htmlFor="">Upfront</label>
            </div>
            <div className="d-flex align-items-center gap-1">
            <input type="radio" name='regFeeMode' value={2} 
            checked={details.regFeeMode === 2 ? details.regFeeMode: null} onChange={handleChange}/>
                <label htmlFor="">Upon acceptance</label>
            </div>
        </div>
        </div>
     </div>
     <div
        className="d-flex justify-content-end gap-3 py-4 px-2"
        style={{ backgroundColor: "#FAFAFA", borderRadius: "0 0 10px 10px" }}
      >
        <button
          className="btn btn-md rounded-5 py-1 px-3"
          style={{ backgroundColor: "#F7F7F7", fontSize:'14px' }}
          type="reset"
          
        >
          Discard
        </button>
        <button
          className="btn btn-md text-white rounded-5"
          style={{ backgroundColor: "var(--custom-color)", fontSize:'14px' }}
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

export default CooperativeInfo
