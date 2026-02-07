import React, { useContext, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../axios'
import { UserContext } from '../AuthContext'
import { toast, ToastContainer } from 'react-toastify'

const UpdateCandidate = () => {
    const [input, setInput]= useState({})
    const [image, setImage]= useState('')
    const [file, setFile]= useState('')
    const [elections, setElections]= useState([])
    const [positions, setPositions]= useState([])
    const {id}= useParams()
    const navigate=useNavigate()
    const {credentials}= useContext(UserContext)

    const getPositions=()=>{
        axios('Election/election-positions-slim', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setPositions(resp.data.data.positions))
    }
    const getElections=()=>{
        axios('Election/get-elections-slim', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setElections(resp.data.data))
    }
    const getCandidate=()=>{
        axios(`Election/get-contestant?id=${id}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setInput(resp.data.data))
    }
    useEffect(()=>{
        getCandidate()
        getElections()
        getPositions()
    },[])
    const handleChange=(e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setInput({...input, [name]:value})
    }
    const updateCandidate=(e)=>{
        e.preventDefault()
        const payload = new FormData()
        payload.append('id', id)
        payload.append('PositionId', input.positionId)
        payload.append('ElectionId', input.electionId)
        payload.append('FullName', input.fullName)
        payload.append('MemberId', input.memberId)
        payload.append('ProfileImage', image ? image : input.profileImage)
        payload.append('ManifestoDocumentFile', file ? file : input.manifestoDocument)
        axios.post('Election/update-contestant', payload, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
          toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
          setTimeout(() => {
            navigate(-1)
          }, 5000);
        })
        .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
    }

  return (
    <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
    <div
      className="py-3 px-4 justify-content-between align-items-center d-flex"
      style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
    >
      <p style={{ fontWeight: "500", fontSize: "16px" }}>
      <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> Update candidate details
        </p>
    </div>
    <form onSubmit={updateCandidate}>
      <div className="admin-task-forms px-3">
        <div className="d-flex flex-column gap-1">
        <label htmlFor="fullName">Candidate Full name</label>
        <input type="text" name='fullName' onChange={handleChange} value={input.fullName}/>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="positionId">Position </label>
            <select type="text" name='positionId' value={input?.positionId} required onChange={handleChange}>
            <option value="">Select</option>
            {
                positions.map(position=>(
                    <option value={position.id} key={position.id}>{position.name}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
        <label htmlFor="electionId">Election</label>
        <select type="text" name='electionId' value={input?.electionId} required onChange={handleChange} >
            <option value="">Select</option>
            {
                elections.map(election=>(
                    <option value={election.id} key={election.id}>{election.title}</option>
                ))
            }
        </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="profileImage">Profile image</label>
            <input type="file" name='image' accept="image/png, image/gif, image/jpeg"  
            onChange={(e)=>setImage(e.target.files[0])} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="file">Manifesto document</label>
            <input type="file" name='file' accept=".doc, .docx, .pdf"
             onChange={(e)=>setFile(e.target.files[0])} />
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
      style={{ backgroundColor: "#0452C8", fontSize: "14px" }}
      type="submit"
    >
      Update
    </button>
      </div>
    </form>
    <ToastContainer/>
    </div>
  )
}

export default UpdateCandidate
