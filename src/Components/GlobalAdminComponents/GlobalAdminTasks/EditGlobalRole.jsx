import React, { useContext, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { toast } from 'react-toastify'

const EditGlobalRole = () => {
    const [privileges, setPrivileges]= useState([])
    const [detail, setDetail]= useState({})
    const {id}= useParams()
    const {credentials}= useContext(UserContext)
    const navigate= useNavigate()
    const getDetails= async()=>{
        axios(`Admin/global-role?nodeId=${id}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
            setDetail(resp.data.data)
            setPrivileges(resp.data.data.privilegdes)
        })
    }
  useEffect(()=>{
getDetails()
  }, [id])
  const editTenant=async(e)=>{
    const payload={
      nodeId: Number(id),
      privileges: privileges.filter(privilege=>(privilege.isAssigned === true))
    }
    e.preventDefault()
    await axios.post('Admin/update-global-role', payload, {headers:{
        Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
        toast(resp.data.message, {type:'success', autoClose:5000})
        setTimeout(() => {
        navigate(-1)
        }, 5000);
    }).catch(error=>toast(error.response.data.message))
  }
  const handleCheck = (e) => {
    let updatedList = privileges.map((account) => {
      if (account.menuName === e) {
        return { ...account, isAssigned: !account.isAssigned };
      }
      return account;
    });
    setPrivileges(updatedList);
  };
  const handleChange=(e)=>{
    const name = e.target.name;
    const value = e.target.value
    setDetail({...detail, [name]:value})
  }
  return (
    <>
    <h4 style={{fontSize:'16px', color:'#1d1d1d', margin:'1rem 0'}}>Global role configuration</h4>
<div className="rounded-4" style={{border:'solid 1px #f7f4f7'}}>
<div
  className="py-3 px-4 form-header"
  style={{ backgroundColor: '#f4fAfd', borderRadius:'15px 15px 0 0' }}
>
  <div style={{fontSize:'16px', fontWeight:'500', color:'#4D4D4D'}}>
    <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> Edit tenant
  </div>

</div>
<form onSubmit={editTenant}>
          <div className="d-flex flex-column gap-1 p-3">
            <label htmlFor="tenant">
              Tenant Name <sup className="text-danger">*</sup>
            </label>
            <input
              type="text"
              className="w-100"
              name="tenantName"
              value={detail?.tenantName}
              style={{
                backgroundColor: "#F7F7F7",
                border: "solid 1px #F7F7F7",
                borderRadius: "12px",
                padding: "5px",
              }}
              onChange={handleChange}
            />
          </div>
          <div className='px-3 mb-3'>
            <h4 style={{fontSize:'16px'}}>Global data capture privileges</h4>
          <div className="statutory-list">
            {privileges?.map((account) => (
              <div className="d-flex justify-content-between align-items-center">
                <div
                  className="d-flex gap-2 align-items-center"
                  style={{ fontSize: "14px" }}
                >
                  <input
                    type="checkbox"
                    name={account.menuName}
                    onChange={() => handleCheck(account.menuName)}
                    checked={account?.isAssigned}
                  />
                  <span style={{ fontSize: "12px" }}>{account.menuName}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                    fontSize: "12px",
                    color: "#333",
                    borderRadius: "1.5rem",
                    border: "none",
                    padding: "8.33px",
                  }}
                  className={account.isAssigned === true ? "mapped" : "un-mapped"}
                >
                  <hr
                    className={
                      account.isAssigned === true ? "hr-map" : "un-mapped-hr"
                    }
                  />
                  <span>
                    {account.isAssigned === true ? "Mapped" : "Unmapped"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          </div>
          <div
            style={{
              backgroundColor: "#f2f2f2",
              borderRadius: "0 0 10px 10px",
            }}
            className="d-flex justify-content-end gap-3 p-3"
          >
            <button type="submit" className="btn-sm member px-3 border-0">
              Proceed
            </button>
          </div>
        </form>
</div>
</>
  )
}

export default EditGlobalRole
