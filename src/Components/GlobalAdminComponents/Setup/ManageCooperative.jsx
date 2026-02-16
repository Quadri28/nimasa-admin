import React, { useContext, useEffect, useState } from 'react'
import CooperativeInfo from './CooperativeInfo'
import AccountInfo from './AccountInfo'
import LogoAndByeLaw from './LogoAndByeLaw'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'

const ManageCooperative = () => {
    const [active, setActive]= useState('info')
    const [details, setDetails] =useState({
      acctOpenSms:0,
      address:"",
      bankCode:"",
      bankFax:"",
      bankName:"",
      cashAccount:"",
      cooperativeCategory:0,
      cooperativeType:0,
      currencyCode:0,
      documentPathID:"",
      email:"",
      expenseAccount:"",
      incomeAccount:"",
      lastFinancialYear:"",
      logoPathId:"",
      multiacct:0,
      nextFinancialYear:"",
      pAndLAccount:"",
      payableAccount:"",
      phone:"",
      priorpandlacct:"",
      regFee:0,
      regFeeAccount:"",
      regFeeMode:0,
      serverName:"",
      slogan:"",
      smsreq:0,
      state:""
    });
    const {credentials}= useContext(UserContext)

    const getProfile = async () => {
      await axios("SetUp/general-setup", {
       headers: {
         Authorization: `Bearer ${credentials?.token}`,
       },
     }).then((resp) => {
      const data = resp.data.data;
      setDetails({
        ...data,
        lastFinancialYear: data.lastFinancialYear ? new Date(data.lastFinancialYear.replace(/-/g, "/")) : null,
        nextFinancialYear: data.nextFinancialYear ? new Date(data.nextFinancialYear.replace(/-/g, "/")) : null,
      });
    });
   };

   useEffect(() => {
    getProfile();
  }, []);
  const handleChange = (event) => {
    if (event instanceof Date) {
      setDetails((prev) => ({ ...prev, lastFinancialYear: event }));
    } else {
      const { name, value } = event.target;
      setDetails((prev) => ({ ...prev, [name]: value }));
    }
  };
    const getComponents=()=>{
        if (active ==='info') {
            return <CooperativeInfo details={details} handleChange={handleChange}/>
        }else if (active === 'bank') {
            return <AccountInfo details={details} handleChange={handleChange} 
            />
        }else if (active === 'logo') {
         return <LogoAndByeLaw/>   
        }
    }
    
  return (
    <div className='card rounded-4 border-0 px-3 pt-4'>
        <div className="d-flex gap-4 align-items-center mb-3 flex-wrap">
     <span className={active === 'info' ? 'active-navigator' : 'in-active-navigator'}
     onClick={()=>setActive('info')}> Cooperative Information</span>
     <span className={active === 'bank' ? 'active-navigator' : 'in-active-navigator'}
      onClick={()=>setActive('bank')}> Account Information</span>
     <span className={active === 'logo' ? 'active-navigator' : 'in-active-navigator'}
      onClick={()=>setActive('logo')}> Logo & ByeLaw Upload</span>
        </div>
     {
        getComponents()
     }
    </div>
  )
}

export default ManageCooperative
