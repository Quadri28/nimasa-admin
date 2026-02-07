import React, { useContext, useEffect, useState } from 'react'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { BsArrowLeft } from 'react-icons/bs'
import { toast, ToastContainer } from 'react-toastify'

const ResetUser = () => {
    const [detail, setDetail]=useState({})
    const [password, setPassword]= useState(false)
    const [input, setInput]= useState('')
    const{id}= useParams()
    const{credentials}= useContext(UserContext)

    const getUserDetail=()=>{
        axios(`Users/get-user?uniqueId=${id}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setDetail(resp.data.data))
    }
    useEffect(()=>{
        getUserDetail()
    },[])
    const navigate= useNavigate()
    const handleChange=(e)=>{
        const name=e.target.name;
        const value= e.target.value
        setDetail({...detail, [name]:value})
    }
    const resetUser=(e)=>{
  e.preventDefault()
  const payload={
  uniqueId: id,
  allowMultipleLogin: detail.multiLogin === 1 ? true : false,
  resetMultipleLogin: password,
  statusLocked: detail.statusLocked,
  allowResetPassword: password,
  newPassword: input,
  confirmNewPassword: input
  }
  axios.post('Users/reset-user', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    toast(resp.data.data, {type:'success', autoClose:5000, pauseOnHover:true})
  }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
    }
  return (
    <div className='bg-white p-3 rounded-3'>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Reset user</h4>
      </div>
     
      <form onSubmit={resetUser}>
      <div className='p-3' 
      style={{backgroundColor:'#F5F9FF', borderRadius:'15px 15px 0 0'}}>
        <div className=' d-flex align-items-center gap-2 title-link' onClick={()=>navigate(-1)}>
      <BsArrowLeft/> <span style={{fontSize:'14px'}}> Reset user </span>
      </div>
      </div>
      <div className="px-3 py-4" style={{borderInline:'1px solid #ddd'}}>
        <div className='admin-task-forms'>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="userId">Staff user ID<sup className="text-danger">*</sup></label>
          <input type="text" name='userId' value={detail?.userId} onChange={handleChange} />
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="staffName">Full name<sup className="text-danger">*</sup></label>
          <input type="text" name='staffName' value={detail?.staffName} onChange={handleChange}/>
        </div>
        </div>
        <div className='statutory-list'>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="multipleLogin">Allow multiple login<sup className="text-danger">*</sup></label>
          <span className="d-flex align-items-center gap-1" style={{fontSize:'14px'}}>
            <input type='checkbox' name='multipleLogin' value={detail?.multiLogin}/> Yes, allow multiple logins
            </span>
        </div>
        <div className="d-flex flex-column gap-1">
            <div>
          <label htmlFor="password">Reset password<sup className="text-danger">*</sup></label>
          <span className="d-flex align-items-center gap-1" style={{fontSize:'14px'}}>
             <input type='checkbox' name='password' 
             onChange={(e)=>{
                setPassword(e.target.checked)
                console.log(e.target.checked)
                }} /> Yes
            </span>
            </div>
            </div>
           {password ? <div className="d-flex flex-column">
                    <label htmlFor="newPassword">Enter password</label>
                    <input type="password" name='input' onChange={(e)=>setInput(e.target.value)} />
            </div>: ''}
        </div>
        </div>
      <div style={{ backgroundColor: "#f2f2f2", borderRadius:'0 0 10px 10px' }}
            className="d-flex justify-content-end gap-3 p-3" >
            <button type="reset" className="btn btn-sm rounded-5" style={{backgroundColor:'#f7f7f7'}}>Discard</button>
            <button type="submit" className="btn btn-sm member">Proceed</button>
          </div>
      </form>
      <ToastContainer/>
      </div>
  )
}

export default ResetUser
