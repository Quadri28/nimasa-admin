import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from './axios';
import { toast, ToastContainer } from 'react-toastify';

const ConfirmAccount = () => {
const [error, setError]= useState('')
const [loading, setLoading]= useState(false)

const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const confirmCode = searchParams.get('ActivationCode');
const navigate = useNavigate()
const confirmAccount = ()=>{
    setLoading(true)
      const toastOptions ={
        autoClose: 5000,
        pauseOnHover: true,
        type: 'success'
      }
    axios.post(`Account/cooperative-signup-verification?ActivationCode=${confirmCode}`, {}, {
        headers:{
            Accept: 'application/json'
        }
    }).then((resp)=>{
        toast(resp.data.message, toastOptions)
        setLoading(false)
        setTimeout(() => {
          navigate('/')
        }, 5000);
    }).catch((error)=>{
        toast(error.response.data.message, {type:'error', autoClose:false})
        setLoading(false)
    })
}


useEffect(()=>{
confirmAccount()
}, [])

  return (
    <div className='container d-flex flex-column justify-content-center align-items-center'
     style={{height:'70vh'}}>
        <p className='text-danger'>{
            error ? error : ''
            }
        </p>
      <div className="card text-center px-3 py-4">
        <h3>Confirm Account</h3>
       {
        loading ? <p>Loading...</p> : ''
       }
      </div>
      <ToastContainer/>
    </div>
  )
}

export default ConfirmAccount
