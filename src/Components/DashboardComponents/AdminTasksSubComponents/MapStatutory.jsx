import { Field, Formik, Form, ErrorMessage } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import ErrorText from '../ErrorText'
import { BsArrowLeft } from 'react-icons/bs'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { toast, ToastContainer } from 'react-toastify'

const MapStatutory = () => {
  const [reports, setReports]=useState([])
  const [accounts, setAccounts]=useState([])
  const [heads, setHeads]= useState([])
  const [reportType, setReportType]= useState({})
  const {credentials}= useContext(UserContext)


const handleChange=(e)=>{
  const name=e.target.name;
  const value= e.target.value;
  setReportType({...reportType, [name]:value })
}

  const getHeads=()=>{
    axios(`Admin/report-item-head?reportType=${reportType.report}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setHeads(resp.data.data)
    })
  }
  useEffect(()=>{
    getHeads()
  }, [reportType.report])
  const getReports=()=>{
    axios('Admin/report-type', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setReports(resp.data))
  }

  useEffect(()=>{
    getReports()
  },[])

  const getAccounts=()=>{
    axios(`Admin/map-statutory-report?ReportType=${reportType.report}&ReportItemHead=${reportType.statement}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      if (resp.data.data.gLs) {
        setAccounts(resp.data.data.gLs)
      } })
  }

  useEffect(()=>{
    getAccounts()
  }, [reportType.report, reportType.statement])

  const handleCheck = (e) => {
    let updatedList = accounts.map((account) => {
      if (account.glMap === e) {
        return { ...account, isMapped: !account.isMapped };
      }
      return account;
    });
    setAccounts(updatedList);
  };

  const mapStatutoryReports=(e)=>{
    e.preventDefault()
    const payload={
  glClass: reportType.statement,
  reportType: reportType.report,
  gls: accounts,
    }
    axios.post('Admin/add-gl-map-statutory', payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', pauseOnHover:true, autoClose:5000})
    })
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }

  return (
    <div className='border-0  rounded-4'>
    <h4 style={{fontSize:'18px', fontFamily:'General sans'}}>Map statutory report</h4>
    <form onSubmit={mapStatutoryReports} >
    <div className='bg-white mt-4' style={{border:'solid 1px #f2f2f2', borderRadius:'15px'}}>
      <div className='p-3 d-flex align-items-center gap-2' style={{backgroundColor:'#F5F9FF', borderRadius:'15px 15px 0 0'}}>
     <span style={{fontSize:'14px', color:'#4D4D4D'}}>  Map statutory report </span>
      </div>
        <div className='admin-task-forms my-3 px-3'>
        <div className="d-flex flex-column gap-1 ">
            <label htmlFor="">Select report type</label>
            <select type='text' name='report' onChange={handleChange}>
                <option value="">Select</option>
                {
                  reports.map(report=>(
                    <option value={report.value} key={report.value}>{report.name}</option>
                  ))
                }
                </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="">Select report item</label>
            <select type='text' name='statement' onChange={handleChange}>
                <option value="">Select</option>
                {
                  heads.map(head=>(
                    <option value={head.itemcode} key={head.itemcode}>{head.iteM_DESC}</option>
                  ))
                }
                </select>
        </div>
        </div>
        <div className="statutory-list px-3 my-4">
          {accounts?.map((account, i)=>(
        <div className="d-flex justify-content-between align-items-center flex-wrap" key={i}>
            <div className="d-flex gap-2 align-items-center" style={{fontSize:'14px'}}>
            <input type="checkbox" name={account.glMap} onChange={() => handleCheck(account.glMap)}
                checked={account?.isMapped}/> 
                <span style={{fontSize:'12px'}}>{account.glMap}</span>
            </div>
            <div style={{display:'flex', gap:'5px', alignItems:'center',
            fontSize:'12px', color:'#333', borderRadius:'1.5rem', border:'none', padding:'8.33px'}}
            className={account.isMapped === true ? 'mapped': 'un-mapped'}>
            <hr  className={account.isMapped === true ? 'hr-map': 'un-mapped-hr'}/>
            <span>{account.isMapped === true ?'Mapped': 'Unmapped'}</span>
            </div>
        </div>
          ))}
        </div>
      <div
              style={{ backgroundColor: "#f2f2f2", borderRadius:'0 0 10px 10px' }}
              className="d-flex justify-content-end gap-3 p-3"
            >
              <button type="reset" className="btn btn-sm rounded-5" style={{backgroundColor:'#f7f7f7'}}>Discard</button>
              <button type="submit" className="border-0 btn-sm member">Proceed</button>
            </div>
    </div>
    </form>

    <ToastContainer/>
    </div>
  )
}

export default MapStatutory
