import React, { useContext, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../axios'
import { UserContext } from '../AuthContext'
import { ToastContainer, toast } from 'react-toastify'

const AddContestant = () => {
    const {id}= useParams()
    const [ProfileImage, setProfileImage]= useState('')
    const [positions, setPositions]= useState([])
    const [members, setMembers]= useState([])
    const [manifesto, setManifesto]= useState('')
    const [input, setInput]= useState({})
    const [loading, setLoading]= useState(false)
    const {credentials}= useContext(UserContext)

    const getMembers=()=>{
        axios('MemberManagement/get-member-detail-slim', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setMembers(resp.data.data))
    }
    const handleChange=(e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setInput({...input, [name]:value})
    }

    const getPositions=()=>{
        axios('Election/election-positions', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setPositions(resp.data.data.positions))
    }
    useEffect(()=>{
        getMembers()
        getPositions()
    },[])
    const navigate=useNavigate()
    const addContestant=(e)=>{
        e.preventDefault()
        setLoading(true)
        const payload= new FormData()
        payload.append('PositionId', input.positionId)
        payload.append('ElectionId', id)
        payload.append('MemberID', input.name)
        payload.append('ManifestoDocumentFile', manifesto)
        payload.append('ProfileImage', ProfileImage)
        axios.post('Election/add-contestant', payload, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
          setLoading(false)
            toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
            setTimeout(()=>{
                navigate(-1)
            }, 5000)
        }).catch(error=>{
          toast(error.response.data.message, {type:'error', autoClose:false})
          setLoading(false)
        })
    }
  return (
    <div className="mt-4 bg-white px-3 py-3 rounded-3">
    <div className="my-4">
      <span className="active-selector">Add Contestant</span>
    </div>
    <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
      <div
        className="py-3 px-4 justify-content-between align-items-center d-flex"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
      >
        <p style={{ fontWeight: "500", fontSize: "16px" }}>
        <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/>Add Contestant
          </p>
      </div>
      <form onSubmit={addContestant}>
      <div className="admin-task-forms px-3 py-3">
      <div className="d-flex flex-column gap-1">
            <label htmlFor="name">Select position</label>
            <select type="text" name='positionId' onChange={handleChange} >
            <option value=""></option>
            {
                positions.map(position=>(
                    <option value={position.id} key={position.id}>{position.name}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="name">Select contestant name</label>
            <select type="text" name='name' onChange={handleChange}>
            <option value="">Select</option>
            {
                members.map(member=>(
                    <option value={member.customerId} key={member.customerId}>{member.fullname}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="profileImage">Profile image</label>
            <input type="file" name='profileImage' accept='image/png, image/jpeg, image/gif' 
            onChange={(e)=>setProfileImage(e.target.files[0])} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="manifesto">Manifesto document</label>
            <input type="file" name='manifesto' accept=".doc, .docx, .pdf"
             onChange={(e)=>setManifesto(e.target.files[0])} />
        </div>
      </div>
    <div
    className="d-flex justify-content-end gap-3 py-4 px-2 mt-3"
    style={{ backgroundColor: "#FAFAFA", borderRadius: "0 0 10px 10px" }}
  >
    <button
      className="btn btn-md rounded-5 py-1 px-3"
      style={{ backgroundColor: "#F7F7F7", fontSize: "14px" }}
      type="reset"
    >
      Discard
    </button>
    <button
      className="btn btn-md text-white rounded-5"
      style={{ backgroundColor: "var(--custom-color)", fontSize: "14px" }}
      type="submit"
      disabled={loading}
    >
      Create
    </button>
      </div>
      </form>
    </div>
    <ToastContainer />
    </div>
  )
}

export default AddContestant
