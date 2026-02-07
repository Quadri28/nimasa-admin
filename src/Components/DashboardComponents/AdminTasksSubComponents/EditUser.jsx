import React, { useContext, useEffect, useState } from 'react'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { BsArrowLeft } from 'react-icons/bs'
import { toast, ToastContainer } from 'react-toastify'

const EditUser = () => {
    const {id}= useParams()
    const [detail, setDetail]= useState({})
    const [branches, setBranches] = useState([])
    const [roles, setRoles] = useState([])
    const [statuses, setStatuses]= useState([])
    const [supervisors, setSupervisors]= useState([])
    const [supervisedOtherStaff, setSupervisedOtherStaff]= useState(false)
    const [departments, setDepartments] = useState([])
    const [input, setInput]= useState({})
    const{credentials}= useContext(UserContext)

    const getUserDetail=()=>{
        axios(`Users/get-user?uniqueId=${id}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setDetail(resp.data.data))
    }
    const getStatuses=()=>{
        axios('Users/user-status', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
            setStatuses(resp.data)
        })
    }
    const getSupervisors=()=>{
        axios(`Users/get-supervisor?BranchCode=${detail?.branchCode}&DepartmentCode=${detail?.departmentCode}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }})
        .then(resp=>setSupervisors(resp.data.data))
    }
    useEffect(()=>{
        getSupervisors()
    },[detail?.branchCode, detail?.departmentCode])
    const getBranches=()=>{
        axios('Common/get-branches',  {headers:{
            Authorization: `Bearer ${credentials.token}`
        }})
        .then(resp=>setBranches(resp.data))
    }
    const getRoles=()=>{
        axios('Common/get-roles',  {headers:{
            Authorization: `Bearer ${credentials.token}`
        }})
        .then(resp=>setRoles(resp.data))
    }
    const getDepartments=()=>{
        axios('Common/get-departments', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }})
        .then(resp=>setDepartments(resp.data))
    }
    useEffect(()=>{
        getUserDetail()
        getBranches()
        getRoles()
        getStatuses()
        getDepartments()
    },[])
    const navigate= useNavigate()
    const handleChange=(e)=>{
        const name=e.target.name;
        const value= e.target.value
        setDetail({...detail, [name]:value})
    }
    const editUser=(e)=>{
        e.preventDefault()
    const payload={
  staffid: detail.userId,
  staffName: detail.staffName,
  branch: detail.branchCode,
  department: detail.departmentCode,
  phoneno: detail.mobilePhoneNumber,
  staffstatus: String(detail.status),
  userfunction: String(detail.roleId),
  reportlevel: input.reportLevel,
  postAccountNumber: detail.postAcctNo,
  email: detail.email,
  supervisedOtherStaff: supervisedOtherStaff,
}
  axios.post('Users/update-user', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
    setTimeout(() => {
        navigate(-1)
    }, 5000);
})
  .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}

    const changeHandler=(e)=>{
        const name= e.target.name;
        const value = e.target.value;
        setInput({...input, [name]:value})
    }
  return (
    <div className='bg-white p-3 rounded-3'>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4 style={{fontSize:'16px', color:'#1d1d1d'}}>Edit user</h4>
      </div>
      <form onSubmit={editUser}>
      <div className='p-3' 
      style={{backgroundColor:'#F5F9FF', borderRadius:'15px 15px 0 0',}}>
        <div className=' d-flex align-items-center gap-2 title-link' style={{ width:'fit-content'}} onClick={()=>navigate(-1)}>
      <BsArrowLeft/> <span style={{fontSize:'14px', }}> Edit user </span>
      </div>
      </div>
      <div className="px-3 pt-2 pb-4" style={{borderInline:'1px solid #ddd'}}>
        <div className='admin-task-forms'>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="userId">Staff user ID<sup className="text-danger">*</sup></label>
          <input type="text" name='userId' value={detail?.userId} onChange={handleChange} />
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="userId">Branch<sup className="text-danger">*</sup></label>
          <select type="text" name='branchCode' value={detail?.branchCode} onChange={handleChange} >
            <option value="">Select</option>
            {
                branches.map(branch=>(
                    <option value={branch.branchCode} key={branch.branchCode}>{branch.branchName}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="staffName">Staff name<sup className="text-danger">*</sup></label>
          <input type="text" name='staffName' value={detail?.staffName} onChange={handleChange}/>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="userId">Department<sup className="text-danger">*</sup></label>
          <select type="text" name='departmentCode' value={detail?.departmentCode} onChange={handleChange}>
            <option value="">Select</option>
            {
                departments.map(department=>(
                    <option value={department.departmentId} key={department.departmentId}>{department.departmentName}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="email">Email<sup className="text-danger">*</sup></label>
          <input type="text" name='email' value={detail?.email} onChange={handleChange} />
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="role">Role<sup className="text-danger">*</sup></label>
          <select type="text" name='roleId' value={detail?.roleId} onChange={handleChange} >
            <option value="">Select</option>
            {
                roles.map(role=>(
                    <option value={role.roleId} key={role.roleId}>{role.roleName}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="mobilePhoneNumber">Phone number<sup className="text-danger">*</sup></label>
          <input type="text" name='mobilePhoneNumber' value={detail?.mobilePhoneNumber} onChange={handleChange} />
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="status">User status<sup className="text-danger">*</sup></label>
          <select type="text" name='status' value={detail?.status} onChange={handleChange} >
            <option value="">Select</option>
            {
                statuses.map(status=>(
                    <option value={status.value} key={status.value}>{status.name}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="postAcctNo">Till Account</label>
             <input type="number" name='postAcctNo' onChange={handleChange} value={detail.postAcctNo}/>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="reportLevel">Reports to?</label>
             <select name='reportLevel' onChange={changeHandler} >
            <option value="">Select</option>
            {
                supervisors.map(supervisor=>(
                    <option value={supervisor.userId} key={supervisor.userId}>{supervisor.fullName}</option>
                ))
            }
            </select>
        </div>
        </div>
         <div className="d-flex flex-column gap-1">
          <label htmlFor="supervisedOtherStaff">Does this user supervise others?<sup className="text-danger">*</sup></label>
          <span className="d-flex align-items-center gap-1" style={{fontSize:'14px'}}>
            <input type='checkbox' name='supervisedOtherStaff' onChange={(e)=>setSupervisedOtherStaff(e.target.checked)}/> Yes, the user does
            </span>
        </div>
        </div>
      <div style={{ backgroundColor: "#f2f2f2", borderRadius:'0 0 10px 10px' }}
            className="d-flex justify-content-end gap-3 p-3" >
            <button type="reset" className="btn btn-sm rounded-5" style={{backgroundColor:'#f7f7f7'}}>Discard</button>
            <button type="submit" className="border-0 btn-md member">Proceed</button>
          </div>
      </form>
      <ToastContainer/>
      </div>
  )
}

export default EditUser
