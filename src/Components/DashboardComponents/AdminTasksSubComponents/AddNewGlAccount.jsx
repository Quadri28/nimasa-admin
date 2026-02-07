import React, { useContext, useEffect, useState } from 'react'
import { BsArrowLeft } from 'react-icons/bs'
import axios from '../../axios'
import {UserContext} from '../../AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AddNewGlAccount = () => {
    const {credentials}= useContext(UserContext)
    const [types, setTypes]= useState([])
    const [nodes, setNodes]= useState([])
    const [classes, setClasses]= useState([])
    const [acctNo, setAcctNo]= useState({})
    const [input, setInput]= useState({
      pointing:false,
      swing:false,
      populate:false,
      pointingType:'',
      bookBalance: 0
    })
    const [populate, setPopulate]=useState(false)
    const [posting, setPosting]=useState(false)
    const [swing, setSwing]=useState(false)
    const [currencies, setCurrencies]= useState([])
  
  
    const changeHandler=(e)=>{
      const name=e.target.name
      const value= e.target.value
      setInput({...input, [name]:value})
    }
  const onSubmit=(e)=>{
    e.preventDefault()
    const payload={
    glTypeClassCode: input.glClassCode,
    currencyCode: input.currency,
    accountName: input.accountDescription,
    accountNumber: acctNo.accountNumber,
    bookBalance: input.bookBalance,
    pointing: input.pointing === '0' ? false : true,
    status: 0,
    pointingType: input.pointingType,
    populateGL: populate,
    swing: swing,
    isSystemPosting:posting
    }
    axios.post('GlAccount/create-gl-account', payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
      setTimeout(() => {
        navigate(-1)
      }, 5000);
    })
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }
  const getGlTypes=()=>{
    axios('GlAccount/gl-type', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setTypes(resp.data))
  }
  const getCurrencies=()=>{
    axios('Common/get-currencies', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setCurrencies(resp.data))
  }
  useEffect(()=>{
    getGlTypes()
    getCurrencies()
  }, [])
  
  
  const getAcctNo=()=>{
    axios(`GlAccount/get-account-number-by-gl-class-code?glClassCode=${input.glClassCode}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setAcctNo(resp.data.data))
  }
  
  useEffect(()=>{
    getAcctNo()
  },[input.glClassCode])
  const getGlNodes=()=>{
    axios(`GlAccount/gl-type-node?prodTypeCode=${input.glType}`, {
      headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>setNodes(resp.data.data))
  }
  useEffect(()=>{
  getGlNodes()
  },[input.glType])
  
  const getGlTypeClasses=()=>{
    axios(`GlAccount/gl-type-class?glTypeNodeCode=${input.glTypeNode}`, {
      headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then(resp=>setClasses(resp.data.data))
  }
  useEffect(()=>{
  getGlTypeClasses()
  },[input.glTypeNode])
  
  const navigate=useNavigate()
    return (
      <div className='bg-white p-3 rounded-4'>
      <h4 style={{fontSize:'18px', fontFamily:'General sans'}}>Add new GL account</h4>
        <form onSubmit={onSubmit}>
      <div className='bg-white mt-4' style={{border:'solid 1px #fafafa', borderRadius:'15px'}}>
        <div className='p-3 d-flex align-items-center gap-2' 
        style={{backgroundColor:'#F5F9FF', borderRadius:'15px 15px 0 0', cursor:'pointer'}} onClick={()=>navigate(-1)}>
        <BsArrowLeft/> <span style={{fontSize:'14px', color:'#4D4D4D'}} > Add new GL account </span>
        </div>
        <div className="admin-task-forms px-3">
          <div className="d-flex flex-column gap-1">
            <label htmlFor="glType">GL Type<sup className="text-danger">*</sup></label>
            <select type="text" name='glType' onChange={changeHandler} required>
              <option value="">Select</option>
              {
                types.map(type=>(
                  <option value={type.prodTypeCode} key={type.prodTypeCode}>{type.prodTypeName}</option>
                ))
              }
              </select>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="glTypeNode">GL Type Node<sup className="text-danger">*</sup></label>
            <select type="text" name='glTypeNode' as='select' onChange={changeHandler} required>
              <option value="">Select</option>
              {
                nodes?.map(node=>(
                  <option value={node.gl_NodeCode} key={node.gl_NodeCode}>{node.gl_NodeName}</option>
                ))
              }
              </select>
          </div>
          <div className='d-flex flex-column'>
          <label htmlFor="glClassCode">GL Type Class<sup className="text-danger">*</sup></label>
        <select type="text" name='glClassCode' onChange={changeHandler} required>
          <option value="">Select</option>
          {
            classes?.map(cla=>(
              <option value={cla.gl_ClassCode} key={cla.gl_ClassCode}>{cla.gl_ClassName}</option>
            ))
          }
          </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="accountNumber">GL Account Number<sup className="text-danger">*</sup></label>
          <input type="text" name='accountNumber' disabled value={acctNo?.accountNumber} required/>
        </div>
        <div className='d-flex flex-column'>
          <label htmlFor="accountDescription">GL Account Description<sup className="text-danger">*</sup></label>
        <input type="text" name='accountDescription' onChange={changeHandler} required/>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="bookBalance">Book Balance<sup className="text-danger">*</sup></label>
          <input type="number" onChange={changeHandler} name='bookBalance' required value={input.bookBalance} disabled/>
        </div>
        <div className='d-flex flex-column'>
          <label htmlFor="pointing">Pointing<sup className="text-danger">*</sup></label>
        <select name='pointing' onChange={changeHandler} required>
            <option value="">Select</option>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="status">Status <sup className="text-danger">*</sup></label> 
          <select type="text" name='status' value={0} disabled onChange={changeHandler}>
            <option value="">Select</option>
            <option value={0}>Newly created</option>
            <option value={1}>Available</option>
            <option value={2}>Closed</option>
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="pointingType">Pointing Type <sup className="text-danger">*</sup></label> 
          <select type="text" name='pointingType' required onChange={changeHandler} disabled={input?.pointing}>
            <option value="">Select</option>
            <option value="D">Dr</option>
            <option value="C">Cr</option>
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="currency">Currency <sup className="text-danger">*</sup></label> 
          <select type="text" name='currency' onChange={changeHandler} required>
            <option value="">Select</option>
            {
              currencies.map(currency=>(
                <option value={currency.countryCode} key={currency.countryCode}>{currency.currencyName}</option>
              ))
            }
            </select>
        </div>
        </div>
        <div className="statutory-list p-3">
        {/* <div className="d-flex flex-column gap-1">
          <label htmlFor="populate">Populate GL?</label> 
          <span className='d-flex align-items-center gap-1' style={{fontSize:'14px'}}>Yes, populate GL
            <input name='populate' type='checkbox' onChange={(e)=>setPopulate(e.target.checked)}/></span>
        </div> */}
        <div className="d-flex flex-column gap-1">
          <label htmlFor="swing">Swing?</label> 
          <span className='d-flex align-items-center gap-1' style={{fontSize:'14px'}}>Yes, swing
            <input name='swing' type='checkbox' onChange={(e)=>setSwing(e.target.checked)} /></span>
        </div>
        <div className="d-flex flex-column gap-1">
          <label htmlFor="posting">Is System Posting?</label> 
          <span className='d-flex align-items-center gap-1' style={{fontSize:'14px'}}>
            Yes, system is posting<input name='posting' type='checkbox'onChange={(e)=>setPosting(e.target.checked)} /></span>
        </div>
        </div>
       <div
              style={{ backgroundColor: "#f2f2f2", borderRadius:'0 0 15px 15px' }}
              
              className="d-flex justify-content-end gap-3 p-3"
            >
              <button type="reset" className="btn btn-sm rounded-5" style={{backgroundColor:'#f7f7f7'}}>Discard</button>
              <button type="submit" className="btn-md border-0  member">Proceed</button>
            </div>
      </div>
      </form>
      <ToastContainer/>
    </div>
    )
  }

export default AddNewGlAccount
