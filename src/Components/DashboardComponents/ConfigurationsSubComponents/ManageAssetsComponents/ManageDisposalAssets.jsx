import React, { useContext, useEffect, useState } from 'react'
import { ErrorMessage, Field, Formik, Form } from 'formik'
import { UserContext } from '../../../AuthContext'
import axios from '../../../axios'
import { BsArrowLeft } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const ManageDisposalAssets = () => {
  const {credentials} = useContext(UserContext)
  const [assetInfo, setAssetInfo] = useState({})
  const [input, setInput]= useState({})
   const [id, setId] = useState([]);
   useEffect(() => {
    getAssetsID();
  }, []);
    const getAssetsID = () => {
      axios("AssetsDisposal/get-asset-slim", {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }).then((resp) => setId(resp.data.data));
    };
  
const navigate = useNavigate()
  const getAssetInfo= async()=>{
    await axios(`AssetsDisposal/get-asset-disposal-by-id?assetId=${input?.assetId}`, {
      headers:{
        Authorization: `Bearer ${credentials.token}`
      }
    }).then(resp=>setAssetInfo(resp?.data?.data))
  }

  useEffect(()=>{
    getAssetInfo()
  }, [input?.assetId])
 
  const handleChange = (e)=>{
    const name = e.target.name;
    const value = e.target.value;
    console.log(input)
    setInput({...input, [name]:value})
  }
 
  const onSubmit = (e) => {
    e.preventDefault()
    const payload = {
      assetId: assetInfo.id,
      netbkval: Number(assetInfo.netbkval),
      totalAccummDep: Number(assetInfo.totalAccummdep),
      totalItemcost: Number(assetInfo.totalitemcost),
      narration:input.narration,
    };
    axios
      .post("AssetsDisposal/craete-asset-disposal", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
      })
      .catch((error) => {
        toast(error.response.data.message, {
          type: "error",
          autoClose: 5000,
          pauseOnHover: true,
        });
      });
  };
  return (
    <>
  
    <form style={{ border: "solid .5px #fafafa", borderRadius: "15px" }}
    onSubmit={onSubmit}>
                <div
                  className="p-3"
                  style={{
                    backgroundColor: "#F5F9FF",
                    borderRadius: "15px 15px 0 0",
                  }}
                >
                  <div
                    className=" d-flex align-items-center gap-2 title-link"
                    style={{ width: "fit-content" }}
                    onClick={() => navigate(-1)}
                  >
                    <BsArrowLeft />
                    <span style={{ fontSize: "16px" }}>Manage Asset Disposal </span>
                  </div>
                </div>
    <div className='admin-task-forms px-3'>
      <div className='d-flex flex-column gap-2 g-2'>
          <label htmlFor="assetId">Select Asset:</label>
        <select name='assetId' onChange={handleChange}>
          <option value="">Select</option>
          {
            id.map((id, i)=>(
              <option value={id.assetId} key={id.assetId}>{id.assetName}</option>
            ))
          }
          </select>
        <div className='d-flex flex-column gap-2 g-2'>
          <label htmlFor="disposalAcct">Disposal Account:</label>
        <input name='disposalAcct' id='disposalAcct' value={assetInfo?.disposalAcct} readOnly/>
        </div>
        <div className='d-flex flex-column gap-2 g-2'>
          <label >Accum. Deprec. Account:</label>
        <input name='totalAccummdep' id='totalAccummdep' readOnly disabled value={assetInfo?.totalAccummdep}/>
        </div>
        <div className='d-flex flex-column gap-2 g-2'>
          <label htmlFor="assetAcct">Asset Account:</label>
        <input name='assetAcct' id='assetAcct' readOnly value={assetInfo?.assetAcct}/>
        </div>
        <div className='d-flex flex-column gap-2 g-2'>
          <label htmlFor="narration">Narration:</label>
        <textarea name='narration' id='narration' onChange={handleChange} required/>
        </div>
        </div>
        <div className='d-flex flex-column gap-2'>
          <p className='fw-bold'>Asset Info</p>
          <div className='d-flex gap-3'>
          <label>Asset ID:</label>
          <span > <b>{assetInfo?.id}</b></span>
          </div>
        <div className='d-flex gap-3'>
          <label>Asset Name:</label>
          <span > {assetInfo?.assetClassName} </span>
          </div>
        <div className='d-flex gap-3'>
          <label>Asset Category:</label>
          <span > {assetInfo?.categoryname}</span>
          </div>
        <div className='d-flex gap-3'>
          <label>Purchase Date:</label>
          <span > {assetInfo?.purchaseDate}</span>
          </div>
        <div className='d-flex gap-3'>
          <label >Total Cost:</label>
          <span > {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(assetInfo?.totalitemcost)}</span>
          </div>
        <div className='d-flex gap-3'>
          <label>Accumulated Depreciation:</label>
          <span > {assetInfo?.totalAccummdep}</span>
          </div>
        <div className='d-flex gap-3'>
          <label>Net Book Value:</label>
          <span > {new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(assetInfo?.netbkval)}</span>
         </div>
        <div className='d-flex gap-3'>
          <label>Branch Location:</label>
          <span > {assetInfo?.branchName}</span>
          </div>
        <div className='d-flex gap-3'>
          <label>Department Location:</label>
          <span > {assetInfo?.depName}</span>
          </div>
        <div className='d-flex gap-3'>
          <label>Tag No:</label>
          <span >{assetInfo?.tagNo}</span>
          </div>
        <div className='d-flex gap-3'>
          <label>Asset Status:</label>
          <span > {assetInfo?.statusDesc}</span>
          </div>
        </div>
        </div>
        <div className='d-flex gap-3 mt-3 justify-content-end p-3' 
        style={{backgroundColor:'#f2f2f2', borderRadius:'0 0 15px 15px'}}>
           <button className="btn-md border-0 rounded-5 px-3" type='reset'>
       Reset
     </button>
     <button className="border-0 btn-md member" type='submit'>
       Submit
     </button>
   </div>
        </form>    
        <ToastContainer/>
   </>
  )
}

export default ManageDisposalAssets
