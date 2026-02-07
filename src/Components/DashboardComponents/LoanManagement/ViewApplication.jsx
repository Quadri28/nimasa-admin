import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './ViewApplication.css'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { BsArrowLeft } from 'react-icons/bs'
import { toast, ToastContainer } from 'react-toastify'

const ViewApplication = () => {
    const {id} = useParams()
    const [detail, setDetail]= useState({})
    const [product, setProduct]= useState({})
    const [groups, setGroups]= useState([])
    const [products, setProducts] = useState([])
    const [branches, setBranches] = useState([])
    const [methods, setMethods]= useState([])
    const [models, setModels]= useState([])
    const [types, setTypes]= useState([])
    const [sources, setSources]= useState([])
    const [frequencies, setFrequencies]= useState([])
    const [sourceDetail, setSourceDetail]= useState({})
    const {credentials} = useContext(UserContext)
    const navigate= useNavigate()

    const getSourceDetail=()=>{
        axios(`LoanApplication/loan-funding-source-detail?accountNumber=${detail.loanFundingSource}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setSourceDetail(resp.data.data))
    }
    useEffect(()=>{
getSourceDetail()
    },[detail.loanFundingSource])
    const getLoanSources=()=>{
        axios('LoanApplication/get-loan-source-type', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setSources(resp.data.data))
    }
    const getRepaymentTypes=()=>{
        axios('Common/getloanrepayments', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setTypes(resp.data))
    }
    const getCalcMethods=()=>{
        axios('Common/calculation-method', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setMethods(resp.data))
    }
    const getModels=()=>{
        axios('LoanApplication/get-lending-model', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setModels(resp.data.data))
    }
    const getBranches=()=>{
        axios('Common/get-branches', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setBranches(resp.data))
    }
    const getLoanProducts=()=>{
        axios('LoanApplication/get-loan-product', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setProducts(resp.data.data))
    }
    const getFrequencies=()=>{
        axios('Common/getloanfrequencies', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setFrequencies(resp.data))
    }
    const getGroups=()=>{
        axios('LoanApplication/get-loan-group', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setGroups(resp.data.data))
    }
    const getProductDetails=()=>{
        axios(`LoanApplication/loan-product-detail?loanProductCode=${detail?.loanProduct}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setProduct(resp.data.data))
    }
    const getDetail=()=>{
        axios(`LoanApplication/get-loan-application?LoanApplicationNo=${id}`, {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setDetail(resp.data.data))
    }
    useEffect(()=>{
        getGroups()
        getLoanProducts()
        getBranches()
        getModels()
        getRepaymentTypes()
        getCalcMethods()
        getLoanSources()
        getFrequencies()
    },[])

useEffect(()=>{
getProductDetails()
},[detail?.loanProduct])
 useEffect(()=>{
  getDetail()
 },[id])

const handleChange=(e)=>{
const name= e.target.name;
const value= e.target.value;
setDetail({...detail, [name]:value})
}

const disburseLoan=(e)=>{
    e.preventDefault()
    const payload={
            customerId: detail.customerId,
            group: detail.group,
            loanProduct: detail.loanProduct,
            loanFundingSource: detail.loanFundingSource,
            branch: detail.branch,
            loanAmount: detail.loanAmount,
            loanRate: detail.loanRate,
            term: detail.term,
            frequency: detail.frequency,
            noOfDays: detail.noOfDays,
            postingDate: detail.postingDate,
            calculationMethod: detail.calculationMethod,
            repaymentType: detail.repaymentType,
            collateralValue: detail.collateralValue,
            collateralType: detail.collateralType,
            drawDownDate: detail.drawDownDate,
            startDate: detail.startDate,
            firstPaymentDate: detail.firstPaymentDate,
            maturityDate: detail.maturityDate,
            loanSource: detail.loanSource,
            collateralDetail: detail.collateralDetail,
            accountOfficer:detail.accountOfficer,
            loanPurpose: detail.loanPurpose,
            gaurators: [
              detail.guarantors
            ]         
    }
    axios.post('LoanApplication/loan-application', payload, {headers:{
        Authorization:`Bearer ${credentials.token}`
    }}).then(resp=>toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true}))
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}

  return (
    <div className='card py-4 px-3'>
        <p onClick={()=>navigate(-1)} style={{cursor:'pointer'}}><BsArd-flex flex-columnLeft/></p>
      <div className="top-cards justify-content-between">
        <div className="card px-0" style={{borderRadius:'1rem 1rem 0 0'}}>
            <div style={{backgroundColor:'#EDF4FF', padding:'10px 15px 2px',  borderRadius:'1rem 1rem 0 0'}}>
                <p style={{fontSize:'14px'}} className='text-center'>Product Info</p>
            </div>
            <div className="mt-3 d-flex flex-column gap-2 mb-3" >
                <div className='d-flex justify-content-between px-3'>
                <div className="d-flex gap-2 discourse">
                    <span>Product Name:</span>
                    <p className='rounded-3'>{product?.productName}</p>
                </div>
                <div className="d-flex gap-2 discourse">
                    <span>Product Currency:</span>
                    <p>{product?.currencymne}</p>      
                </div>
            </div>
                <div className="d-flex justify-content-between px-3">
                <div className="d-flex gap-2 discourse">
                    <span >Product Start Date:</span>
                    <p> {product?.productStart}</p>
                </div>
                <div className="d-flex gap-2  discourse">
                    <span >Product Expiry Date:</span>
                    <p> {product?.productExpire}</p>
                </div>
            </div>
            <div className="d-flex justify-content-between px-3">
                <div className="d-flex gap-2 discourse">
                    <span>Min. Loan Amount:</span>
                    <p>{product?.minAmt?.toLocaleString('en-US')}</p>
                </div>
                <div className="d-flex gap-2  discourse">
                    <span>Max. Loan Amount:</span>
                    <p>{product?.maxAmt?.toLocaleString('en-US')}</p>
                </div>
            </div>
            <div className="d-flex justify-content-between px-3">
                <div className="d-flex gap-2 discourse">
                    <span style={{fontSize:'14px'}}>Min. Interest Rate:</span>
                    <p>{product?.minIntrate}</p>
                </div>
                <div className="d-flex gap-2  discourse">
                    <span style={{fontSize:'14px'}}>Max. Interest Rate:</span>
                    <p>{product?.maxIntrate}</p>
                </div>
            </div>
            <div className="px-3">
                <div className="d-flex gap-2 discourse justify-content-between">
                    <span style={{fontSize:'14px'}}>Calc. Method:</span>
                    <p style={{textTransform:'capitalize'}}>{product?.loanCalc}</p>
                </div>
                <div className="d-flex gap-2 justify-content-between">
                    <span style={{fontSize:'14px'}}>Default Repayment Type:</span>
                    <p style={{textTransform:'capitalize'}}>{product?.repayDesc}</p>
                </div>
            </div>
            <div className="d-flex flex-column px-3">
                <div className="d-flex justify-content-between align-items-center">
                    <span style={{fontSize:'14px'}}>Collateral Value</span>
                    <span >{product?.collateralvalue?.toLocaleString('en-US')}</span>
                </div>
            </div>
            </div>
        </div>
        <div className="card px-0" style={{borderRadius:'15px 15px 0 0'}}>
        <div style={{backgroundColor:'#FEF3E6', padding:'10px 15px 10px',  borderRadius:'15px 15px 0 0'}}>
                <h3 className='text-center' style={{fontSize:'14px'}}>Account Info</h3>
            </div>
            <div className="mt-3 d-flex flex-column gap-3" style={{}}>
            <div className="d-flex justify-content-between align-items-center px-3">
                <div className="d-flex gap-2 discourse">
                    <span style={{fontSize:'14px'}}>Account Name</span>
                    <p className='p-1 rounded-3'>{detail?.accountInfo?.accountName}</p>
                </div>              
                <div className="d-flex gap-2 discourse">
                    <span style={{fontSize:'14px'}}>Account Number</span>
                    <span >{detail?.accountInfo?.accountNumber}</span>
                </div>
            </div>
            <div className="d-flex justify-content-between px-3">
                <div className="d-flex  gap-2 discourse">
                    <span style={{fontSize:'14px'}}>Branch</span>
                    <span>{detail?.accountInfo?.branch}</span>
                </div>
                <div className="d-flex gap-2 discourse">
                    <span style={{fontSize:'14px'}}>Book Balance</span>
                    <span >{ new Intl.NumberFormat('en-US', {}).format(detail?.accountInfo?.bookBalance)}</span>
                </div>
            </div>
            <div className="d-flex justify-content-between px-3">
                <div className="d-flex gap-2 discourse">
                    <span style={{fontSize:'14px'}}>Usable balance</span>
                    <span >{new Intl.NumberFormat('en-US', {}).format(detail?.accountInfo?.usableBalance)}</span>
                </div>
                <div className="d-flex gap-2 discourse">
                    <span style={{fontSize:'14px'}}>Effective Balance</span>
                    <span >{new Intl.NumberFormat('en-US', {}).format(detail?.accountInfo?.effectiveBalance)}</span>
                </div>
            </div>
            <div className="d-flex flex-column px-3">
                
                <div className="d-flex justify-content-between align-items-center">
                    <span style={{fontSize:'14px'}}>Account Status</span>
                    <span >{detail?.accountInfo?.accountStatus}</span>
                </div>
            </div>
            <div className="d-flex flex-column px-3 gap-3">
                <div className="d-flex justify-content-between align-items-center">
                    <span style={{fontSize:'14px'}}>Source Type</span>
                    <span >{detail?.accountInfo?.sourceType}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <span style={{fontSize:'14px'}}>Source</span>
                    <span >{detail?.accountInfo?.source}</span>
                </div>
            </div>
            </div>
        </div>
      </div>
      <form onSubmit={disburseLoan}>
      <div className="top-cards-input-container mt-3">
        <div className="d-flex flex-column gap-1">
            <label htmlFor="customerId">Customer ID</label>
            <input type="text" name='customerId' value={detail?.customerId}
             onChange={handleChange}/>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="group">Group Name</label>
            <select type="text" name='group' disabled value={detail?.group} >
            {
                groups.map(group=>(
                    <option value={group.groupId} key={group.groupId}>{group.groupName}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="group">Group ID</label>
            <input type="text" disabled value={detail?.group} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="settlementAccount">Settlement Account</label>
            <select type="text" >
            <option value={sourceDetail?.glNumber}>{sourceDetail?.acctName}</option>
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="loanProduct">Loan Product</label>
            <select type="text" disabled value={detail?.loanProduct} onChange={handleChange}>
            <option value="">Select</option>
            {
                products.map(product=>(
                    <option value={product.productCode} key={product.productCode}>
                        {product.productName}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="loanAmount">Loan Amount</label>
            <input type="text" name='loanAmount' onChange={handleChange} value={detail?.loanAmount} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="branch">Branch</label>
            <select type="text" disabled name='branch' value={detail?.branch} >
            {branches.map(branch=>(
             <option value={branch.branchCode} key={branch.branchCode}>{branch.branchName}</option> 
            ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="maturityDate">Maturity Date</label>
            <input type="text" disabled value={new Date(detail?.maturityDate)?.toLocaleDateString('en-US')} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="loanRate">Loan Rate</label>
            <input type="text"  name='loanRate' onChange={handleChange} value={detail?.loanRate} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="firstPaymentDate">First Payment Date</label>
            <input type="text" disabled value={new Date(detail?.firstPaymentDate)?.toLocaleDateString('en-US')} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="term">Loan Term</label>
            <input type="text" name='term' onChange={handleChange} value={detail?.term} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="groupName">Processing Charges</label>
            <select type="text" disabled value={detail?.groupName} >
            <option value=""></option>
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="frequencyType">Frequency Type</label>
            <select type="text" name='frequency' disabled value={detail?.frequency} >
                {frequencies.map(frequency=>(
                <option value={frequency.freqCode} key={frequency.freqCode}>
                    {frequency.freqName}</option>
                ))
                }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="term"></label>
            <input type="text" name='term' disabled />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="noOfDays">Days</label>
            <input type="text" name='noOfDays' disabled value={detail?.noOfDays} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="lendingModel">Lending Model</label>
            <select type="text" value={detail?.groupName} >
            <option value="">Select</option>
            {
                models.map(model=>(
                    <option value={model.lendingCode} key={model.lendingCode}>{model.lendingName}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="postingDate">Posting Date {new Date(detail?.postingDate).toLocaleDateString('en-US')}</label>
            <input type="date" name='postingDate' onChange={handleChange}
             />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="chargeConcession">Charge Concession</label>
            <input type="text" name='chargeConcession' onChange={handleChange} value={detail?.chargeConcession} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="calculationMethod">Calc. Method</label>
            <select type="text" name='calculationMethod' onChange={handleChange} value={detail?.calculationMethod}>
            <option value="">Select</option>
            {
                methods.map(method=>(
                    <option value={method.value} key={method.value}>{method.name}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="repaymentType">Repayment Type</label>
            <select type="text" name='repaymentType' onChange={handleChange} value={detail?.calculationMethod}>
            <option value="">Select</option>
            {
                types.map(type=>(
                    <option value={type.repayId} key={type.repayId}>{type.repayDesc}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="collateralDetail">Collateral Detail</label>
            <input type="text" name='collateralDetail' onChange={handleChange} value={detail?.collateralDetail} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="loanSource">Loan Source</label>
            <select type="text" name='loanSource' onChange={handleChange} value={detail?.loanSource}>
            <option value="">Select</option>
            {
                sources.map(type=>(
                    <option value={type.loanSourceId} key={type.loanSourceId}>{type.loanSourceName}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="collateralValue">Collateral Value</label>
            <input type="text" name='collateralValue' onChange={handleChange} value={detail?.collateralValue} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="percentLien">percentage Lien %</label>
            <input type="text" name='percentLien' onChange={handleChange} value={detail?.percentLien} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="startDate">Start Date {new Date(detail?.startDate)?.toLocaleDateString('en-US')}</label>
            <input type="date" name='startDate' onChange={handleChange}  />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="lienAmount">Lien Amount</label>
            <input type="text" disabled name='lienAmount' value={detail?.lienAmount} onChange={handleChange}  />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="drawDownDate">Draw down Date {new Date(detail?.drawDownDate)?.toLocaleDateString('en-US')}</label>
            <input type="date" name='drawDownDate' onChange={handleChange}  />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="loanPurpose">Narration</label>
            <input type="text" name='loanPurpose' value={detail?.loanPurpose} onChange={handleChange}  />
        </div>
      </div>
      <div className="d-flex gap-3 mt-4">
        <button className="btn btn-success" type='submit'>Submit</button>
        <button className="btn btn-danger" type='reset'>Reset</button>
      </div>
      </form>
      <ToastContainer/>
    </div>
  )
}

export default ViewApplication
