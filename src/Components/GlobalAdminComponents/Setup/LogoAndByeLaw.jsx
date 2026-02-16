import React, { useContext, useState } from 'react'
import { UserContext } from '../../AuthContext';
import axios from '../../axios';
import { toast, ToastContainer } from 'react-toastify';

const LogoAndByeLaw = () => {
const [byLaw, setByLaw] = useState('')
const [logo, setLogo] = useState('')
const {credentials} = useContext(UserContext)

  const uploadByLaw=(e)=>{
      e.preventDefault();
      const payload = new FormData();
      payload.append("LogoFile", byLaw);
  
      const toastOptions = {
        autoClose: 5000,
        pauseOnHover: true,
        type: "success",
      };
      if (byLaw) {
        axios
          .post("SetUp/update-cooperative-bylaw-document", payload, {
            headers: {
              Authorization: `Bearer ${credentials.token}`,
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
              type: "formData",
            },
          })
          .then(() => {
            toast("ByLaw document uploaded successfully", toastOptions);
          }).catch((error)=>{
            toast(error.message, {autoClose:5000, pauseOnHover:true, type:'error'})
          });
      } else {
        window.alert("No file chosen");
      }
    };
  
  const uploadLogo=(e)=>{
    e.preventDefault();
    const payload = new FormData();
    payload.append("LogoFile", logo);

    const toastOptions = {
      autoClose: 5000,
      pauseOnHover: true,
      type: "success",
    };
    if (logo) {
    axios
      .post("SetUp/update-cooperative-logo", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then(() => {
        setLogo('')
        toast("Logo uploaded successfully", toastOptions);
        console.log(payload);
      });
  }
  else{
    window.alert('Please select a file to upload')
  }
  }

  return (
    <>
     <div style={{border:'solid .5px #F2F2F2'}} className='my-3 rounded-4'>
     <div className="display-container">
        <span style={{fontSize:'14px', color:'#4d4d4d', fontWeight:'400'}}>Logo & ByeLaw Upload</span>
     </div>
    <div className='global-admin-forms px-3'>
       <div style={{border:'solid .5px #F2F2F2'}} className='my-3 rounded-4'>
     <div className="display-container">
        <span style={{fontSize:'14px', color:'#4d4d4d', fontWeight:'400'}}>Logo Upload</span>
     </div>
     <div className="p-3">
     <form onSubmit={uploadLogo}>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="">Logo<sup className="text-danger">*</sup></label>
        <input type="file" name='logo' onChange={(e)=>setLogo(e.target.files[0])} />
      </div>
      <div className="d-flex justify-content-center mt-3">
      <button
      className="btn btn-md text-white rounded-3 px-4"
      style={{ backgroundColor: "var(--custom-color)", fontSize:'14px' }}
      type="submit">Upload Logo</button>
      </div>
      </form>
     </div>
    </div>
    <div style={{border:'solid .5px #F2F2F2'}} className='my-3 rounded-4'>
     <div className="display-container">
        <span style={{fontSize:'14px', color:'#4d4d4d', fontWeight:'400'}}>ByLaw Upload</span>
     </div>
     <div className="p-3">
      <form onSubmit={uploadByLaw}>
      <div className="d-flex flex-column gap-1">
        <label htmlFor="">ByLaw document <sup className="text-danger">*</sup></label>
        <input type="file" name='byLaw' onChange={(e)=>setByLaw(e.target.files[0])}/>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <button 
        className="btn btn-md text-white rounded-3 px-4"
        style={{ backgroundColor: "var(--custom-color)", fontSize:'14px' }}
        type="submit">Upload ByLaw</button>
        </div>
      </form>
     </div>
    </div>
    </div>
    </div>
    <ToastContainer/>
    </>
  )
}

export default LogoAndByeLaw
