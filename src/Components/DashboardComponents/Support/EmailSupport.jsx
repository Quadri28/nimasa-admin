import React, { useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { UserContext } from "../../AuthContext";
import axios from "../../axios";

const EmailSupport = () => {
  const [input, setInput]= useState({
    fullName:'',
    message:'',
    subject:''
  })
  const {credentials} = useContext(UserContext)

  const handleChange =(e)=>{
    const name = e.target.name;
    const value = e.target.value;
    setInput({...input, [name]:value})
  }

  const sendMail = async (e)=>{
    const payload ={
      fullName: input.fullName,
      subject: input.subject,
      message: input.message,
    }
    e.preventDefault()
    await axios.post('Support/email-support', payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
      setInput({
        fullName:'',
        subject:'',
        message:''
      })
    })
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }
  return (
    <div className="card p-3 rounded-4 border-0">
      <h4 className="faq-header">Contact our friendly team</h4>
      <span className="text-center" style={{ color: "#4d4d4d" }}>
        We have agents waiting to resolve your issues. Let us know
      </span>
      <p className="text-center">
        how we can help{" "}
        <a to="#" className="text-dark">
          Send us a mail!
        </a>{" "}
      </p>
      <div className="rounded-4 mt-2" style={{ border: "solid 1px #f7f4f7" }}>
        <form onSubmit={sendMail}>
        <div
          className="py-3 px-4 form-header"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}
        >
          <div className="subtitle">UCP email support</div>
        </div>
        <div className="admin-task-forms p-3">
          <div className="input-container">
            <label htmlFor="subject">
             Subject
              <sup className="text-danger">*</sup>
            </label>
            <input type="text" name="subject" required onChange={handleChange} value={input?.subject}/>
          </div>
          <div className="input-container">
            <label htmlFor="fullName">
              Full name
              <sup className="text-danger">*</sup>
            </label>
            <input type="text" name="fullName" required onChange={handleChange} value={input?.fullName}/>
          </div>
        </div>
        <div className="input-container px-3 pb-3">
            <label htmlFor="message">
              Enter message
              <sup className="text-danger">*</sup>
            </label>
            <textarea type="text" name="message" required onChange={handleChange} value={input?.message}/>
          </div>
          <div className="d-flex justify-content-end gap-3 py-3 px-2 mt-3"
     style={{backgroundColor:'#FAFAFA', borderRadius:'0 0 15px 15px'}}>
        <button className='btn-md rounded-5 px-3 border-0'>Discard</button>
        <button className='member btn-md border-0'>Send mail</button>
    </div>
    </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default EmailSupport;
