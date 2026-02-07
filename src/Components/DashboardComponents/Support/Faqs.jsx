import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'

const SupportFaqs = () => {
  const [faqs, setFaqs]= useState([])
  const [sections, setSections]= useState([])
  const {credentials} = useContext(UserContext)
  const [sectionName, setSectionName]= useState('')
  const [search, setSearch]= useState('')

  const getSections= async()=>{
    await axios('Faq/get-all-faq-question-sections-slim', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setSections(resp.data.data))
  }

  const getFaqs = async ()=>{
    await axios(`Faq/get-faqs?sectionName=${sectionName}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setFaqs(resp.data.data)
    })
  }
  useEffect(()=>{
getSections()
  }, [])

  useEffect(()=>{
    getFaqs()
  }, [sectionName])


  return (
    <div className='card p-3 rounded-4 border-0'>
      <h4 className='faq-header'>Frequently asked question</h4>
      <span className='text-center'>
        These are the commonly asked questions about UCP. Can’t find what you’re looking for? </span>
        <Link to='/support/email-support' className="mx-auto mt-2 text-dark"
         style={{width:'fit-content'}}>
        Chat to our friendly team!</Link>
        <div className='input-container mt-3 mx-auto' style={{width:'50%'}}>
          <label htmlFor="">Search</label>
        <input type="text" name='search' onChange={(e)=>setSearch(e.target.value)} style={{height:'3rem'}}/>
        </div>
       {sections.length > 0 && <div className="d-flex gap-3 justify-content-center flex-wrap mt-3">
          <span  className={sectionName === '' ? 'active-section-name' : 'section-name'} onClick={()=>setSectionName('')}>All</span>
        {
          sections.map(section=>(
            <span key={section.id} className={sectionName === section.sectionName ? 'active-section-name' : 'section-name'}
             onClick={()=>setSectionName(section.sectionName)}>{section.sectionName}</span>
          ))
        }
        </div>}
        
          {
            faqs?.map(faq=>(
              faq.faqQuestions?.map(faq=>(
        <div className="rounded-4 mt-3" style={{ border: "solid 1px #f7f4f7" }}>
                <div
                className="p-3 form-header"
                style={{
                  backgroundColor: "#f4fAfd",
                  borderRadius: "15px 15px 0 0",
                }}
              >
                <div className="subtitle">{faq.questionText}</div>
              </div>
              <div className="bg-white p-3">
                {faq.answerText}
              </div>
              </div>
              ))
            ))
          }
       
    </div>
  )
}

export default SupportFaqs
