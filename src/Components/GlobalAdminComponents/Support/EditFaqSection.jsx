import React, { useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from '../../AuthContext';

const EditFaqSection = () => {
    const [input, setInput]= useState({})
    const {credentials}= useContext(UserContext)
    const {id}= useParams()

    const handleChange=(e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setInput({...input, [name]:value})
    }

    const getFaqSection=async()=>{
        await axios(`FaqSection/get-faq-question-section-by-id?id=${id}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setInput(resp.data.data))
    }
    useEffect(()=>{
        getFaqSection()
    }, [id])

    const navigate = useNavigate()
    const handleSubmit= async(e)=>{
        const payload={
            id: id,
            sectionName: input.sectionName,
            description: input.description
        }
        e.preventDefault()
        await axios.put('FaqSection/update-faq-question-section', payload, {headers:{
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
    <>
      <span className="active-selector">Create FAQ section</span>
      <form onSubmit={handleSubmit}>
    <div className="rounded-4 mt-4" style={{border:'solid 1px #f7f4f7'}}>
    <div
      className="py-3 px-4 form-header"
      style={{ backgroundColor: '#f4fAfd', borderRadius:'15px 15px 0 0' }}
    >
      <div style={{fontSize:'16px', fontWeight:'500', color:'#4D4D4D'}}>
      <BsArrowLeft style={{cursor:'pointer'}} onClick={()=>navigate(-1)}/> Create FAQ section
      </div>
    </div>
    <div className="d-flex flex-column form-content gap-3 pt-3 px-4 pb-4">
    <div className="d-flex flex-column gap-1">
        <label htmlFor="sectionName">Section name</label>
        <input type="text"  name='sectionName' onChange={handleChange} value={input?.sectionName} />
    </div>
    <div className="d-flex flex-column gap-1">
        <label htmlFor="description">Description</label>
        <textarea type="text"  name='description' onChange={handleChange} value={input?.description}/>
    </div>
    </div>
    <div
          className="d-sm-flex justify-content-end gap-3 mt-3 p-3"
          style={{ backgroundColor: "#FAFAFA", fontSize:'14px', borderRadius:'0 0 15px 15px' }}
        >
          <button className="btn-sm border-0 px-3 rounded-4" type="reset">
            Discard
          </button>
          <button
            className='btn btn-sm pub-btn px-3'
            type="submit"
          >
            Create
          </button>
        </div>
    </div>
    </form>
    </>
  )
}

export default EditFaqSection
