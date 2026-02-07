import React, { useContext, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AddSettlementAccount = () => {
    const [input, setInput]= useState({})
    const [banks, setBanks]= useState([])
    const {credentials}= useContext(UserContext)
    const handleChange=(e)=>{
        const name= e.target.name;
        const value= e.target.value;
        setInput({...input, [name]:value})
    }

    const onSubmit=(e)=>{
        e.preventDefault()
        const payload={

        }
        axios.post('', payload, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true}))
        .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
    }
    const navigate= useNavigate()
    const getBanks=()=>{
        axios('Common/get-banks', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setBanks(resp.data))
    }
    useEffect(()=>{
        getBanks()
    },[])
  return (
    <div className='bg-white p-3 rounded-4'>
    <h4 style={{fontSize:'18px', fontFamily:'General sans'}}>Add new settlement account</h4>
      <form onSubmit={onSubmit}>
    <div className='bg-white mt-4' style={{border:'solid 1px #ddd', borderRadius:'15px'}}>
      <div className='p-3 d-flex align-items-center gap-2' 
      style={{backgroundColor:'#F5F9FF', borderRadius:'15px 15px 0 0'}}>
      <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> <span style={{fontSize:'14px', color:'#4D4D4D'}}> Add new settlement account </span>
      </div>
      <div className="admin-task-forms px-3 pb-3 ">
        <div className="d-flex flex-column gap-1">
            <label htmlFor="">Select bank <sup className='text-danger'>*</sup></label>
            <select type="text" name='bank' onChange={handleChange}>
            <option value="">Select bank</option>
            {
                banks.map(bank=>(
                    <option value={bank.bankCode} key={bank.bankCode}>{bank.bankName}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
        <label htmlFor="accountNumber">Account number <sup className="text-danger">*</sup></label> 
        <input type="text" name='accountNumber' onChange={handleChange}/>   
        </div>
      </div>
      <div
            style={{ backgroundColor: "#f2f2f2", borderRadius:'0 0 10px 10px' }}
            
            className="d-flex justify-content-end gap-3 p-3"
          >
            <button type="reset" className="btn btn-sm rounded-5" style={{backgroundColor:'#f7f7f7'}}>Discard</button>
            <button type="submit" className="btn btn-sm member">Proceed</button>
          </div>
      </div>
      </form>
      
    </div>
  )
}

export default AddSettlementAccount
