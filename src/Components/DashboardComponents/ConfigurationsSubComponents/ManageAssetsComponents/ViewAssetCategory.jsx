import React, { useContext, useEffect, useState } from 'react'
import axios from '../../../axios'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../../../AuthContext'
import { BsArrowLeft } from 'react-icons/bs'

const ViewAssetCategory = () => {
    const [assets, setAssets] = useState({
        categoryCode:'',
        debitAccount:'',
        categoryName:'', 
        creditAccount:'',
        depreciationRate:'',
        suspenseAccount:'',
        residualValue:'',
        disposalAccount:'',
        lifeSpan:'',
        assetAccount:'',
    })
    const navigate = useNavigate()
    const {id} = useParams()
    const {credentials} = useContext(UserContext)
    const getAssets= async ()=>{
        await axios(`AssetCategory/get-fixed-assets-category-by-code?fixedAssetCategory=${id}`, {headers:{
            Authorization: `Bearer ${credentials?.token}`
        }}).then((resp)=>setAssets(resp.data.data))
    }

    useEffect(()=>{
        getAssets()
    }, [])
  return (
    <div className='card rounded-4 mt-3' style={{border:'solid .5px #fafafa'}}>
        <div className="justify-content-center p-3"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "8px 8px 0 0" }}>
          <div className='d-flex gap-2 align-items-center'>
           <BsArrowLeft style={{fontSize:'20px', cursor:'pointer'}} onClick={()=>navigate(-1)}/> 
           View Asset Category
          </div>
      </div>
      <form className='mb-4'>
          <div className="px-4 admin-task-forms">
            <div className="row g-2">
              <label htmlFor="code" >
                Category Code
              </label>
              <input name="categoryCode" id="categoryCode" value={assets?.categoryCode} readOnly/>
            </div>
            <div className="row g-2">
              <label htmlFor="debitAccount" >
                Debit Account 
              </label>
              <input name="debitAccount" id="debitAccount" value={assets?.debitAccount} readOnly/>
            </div>
            <div className="row g-2">
              <label htmlFor="categoryName" >
                Category Name <sup className="text-danger">*</sup>
              </label>
              <input name="categoryName" id="categoryName" readOnly  value={assets?.categoryName} />
            </div>
            <div className="row g-2">
              <label htmlFor="creditAccount" >
                Credit Account 
              </label>
              <input name="creditAccount" id="creditAccount" type="number" value={assets?.creditAccount}  readOnly/>
            </div>
            <div className="row g-2">
              <label htmlFor="depreciationRate" >
                Depreciation Rate 
              </label>
              <input name="depreciationRate" id="depreciationRate"  value={assets?.depreciationRate}  readOnly/>
            </div>
            <div className="row g-2">
              <label htmlFor="suspenseAccount" >
                Suspense Account 
              </label>
              <input name="suspenseAccount" id="suspenseAccount"   value={assets.suspenseAcct}  readOnly/>
            </div>
            <div className="row g-2">
              <label htmlFor="residualValue" >
                Residual Value 
              </label>
              <input name="residualValue" id="residualValue"   value={assets.residualValue}  readOnly/>
            </div>
            <div className="row g-2">
              <label htmlFor="disposalAccount" >
                Disposal Account 
              </label>
              <input name="disposalAccount" id="disposalAccount"  value={assets.disposalAccount}  readOnly/>
            </div>
            <div className="row g-2">
              <label htmlFor="lifeSpan" >
                Life Span (Months)
              </label>
              <input name="lifeSpan" id="lifeSpan"  value={assets.lifeSpan}  readOnly/>
            </div>
            <div className="row g-2">
              <label htmlFor="assetAccount" >
                Asset Account 
              </label>
              <input name="assetAccount" id="assetAccount"  value={assets.assetAccount}  readOnly/>
            </div>
          </div>
          </form>
    </div>
  )
}

export default ViewAssetCategory
