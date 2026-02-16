import React, { useContext, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { toast } from 'react-toastify'

const CreateFaqs = () => {
    const [input, setInput]= useState({})
    const [sections, setSections]= useState([])
    const navigate = useNavigate()
    const {credentials} = useContext(UserContext)
    const handleChange=(e)=>{
        const name = e.target.name;
        const value = e.target.value;
        setInput({...input, [name]:value})
    }

    const fetchSections=()=>{
      axios('FaqSection/get-all-faq-question-sections-slim', {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>setSections(resp.data.data))
    }
    useEffect(()=>{
      fetchSections()
    }, [])

    const handleSubmit=(e)=>{
        e.preventDefault()
        const payload={
            questionName: input.questionName,
            answer: input.answer,
            faqSectionId: input.section,
            isActive: true,
            isDeleted: false
        }
        axios.post('Faq/create-faq-question', payload, {headers:{
          Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>{
          toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
          setTimeout(() => {
            navigate(-1)
          }, 5000);
        }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
    }
  return (
    <>
    <div className='active-selector mb-4' style={{width:'fit-content'}}>
    Create Faqs
    </div>
    <div style={{border:'solid 1px #F2F2F2', borderRadius:'15px'}}>
      <div
      className="py-3 px-4 form-header"
      style={{ backgroundColor: '#f4fAfd', borderRadius:'15px 15px 0 0' }}
    >
      <div style={{fontSize:'16px', fontWeight:'500', color:'#4D4D4D'}}>
       <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/> Create FAQs
      </div>
    </div>
        <form onSubmit={handleSubmit}>
            <div className="admin-task-forms p-3">
                <div className="d-flex gap-1 flex-column">
                    <label htmlFor="questionName">Question</label>
                    <input type="text" name='questionName' onChange={handleChange} required/>
                </div>
                <div className="d-flex gap-1 flex-column">
                    <label htmlFor="answer">Answer</label>
                    <input type="text" name='answer' onChange={handleChange} required/>
                </div>
                <div className="d-flex gap-1 flex-column">
                    <label htmlFor="section">Section</label>
                    <select type="text" name='section' onChange={handleChange} >
                      <option value="">Select section</option>
                      {
                        sections.map(section=>(
                          <option value={section.id} key={section.id}>{section.sectionName}</option>
                        ))
                      }
                      </select>
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
        </form>
    </div>
    </>
  )
}

export default CreateFaqs
