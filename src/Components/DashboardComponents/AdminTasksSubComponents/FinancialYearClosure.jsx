import React, { useContext, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import {UserContext} from '../../AuthContext'
import axios from '../../../Components/axios'
import { toast, ToastContainer } from 'react-toastify'

const FinancialYearClosure = () => {
  const {credentials}= useContext(UserContext)
    const [detail, setDetail]= useState({})
 
  const getDetail=()=>{
    axios('Admin/end-of-year-fiscal-report', {headers:{
      Authorization:`Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success'})
      setDetail(resp.data.data)
    })
  }
  useEffect(()=>{
    getDetail()
    },[])

    const onSubmit=(e)=>{
      e.preventDefault()
      const payload={}
      axios.post('Admin/end-of-year-fiscal-report-drop', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:5000}))
      .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
    }
    return (
        <div className='bg-white p-3 rounded-4'>
        <h4 style={{fontSize:'18px', fontFamily:'General sans'}}>Financial year closure</h4>
        <div className='bg-white mt-4' style={{border:'solid 1px #ddd', borderRadius:'15px'}}>
          <div className='p-3 d-flex align-items-center gap-2' style={{backgroundColor:'#F5F9FF', borderRadius:'15px 15px 0 0'}}>
          <BsArrowLeft/> <span style={{fontSize:'14px', color:'#4D4D4D'}}> Financial year closure</span>
          </div>
            <form onSubmit={onSubmit}>
            <div  className='admin-task-forms my-4 p-3'>
            <div className="d-flex flex-column gap-1 ">
                <label htmlFor="">Financial closure account</label>
                <input name='closureAcct' value={detail?.closureAcct} disabled/>
                 
            </div>
            <div className="d-flex flex-column gap-1">
                <label htmlFor="">Fiscal year closure date</label>
                <input type='text' name='currentProcessingDate' disabled value={detail?.currentProcessingDate}/>
            </div>
            </div>
          <div
                  style={{ backgroundColor: "#f2f2f2", borderRadius:'0 0 10px 10px' }}
                  className="d-flex justify-content-end gap-3 p-3"
                >
                  <button type="reset" className="border-0 px-3 btn-md rounded-5" style={{backgroundColor:'#f7f7f7'}}>Discard</button>
                  <button type="submit" className="border-0  btn-md member" disabled={!detail}>Proceed</button>
                </div>
        </form>
        </div>
        <ToastContainer/>
        </div>
      )
    }

export default FinancialYearClosure
