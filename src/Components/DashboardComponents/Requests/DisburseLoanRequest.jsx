import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from '../../axios'
import { UserContext } from '../../AuthContext'
import { BsArrowLeft } from 'react-icons/bs'
import { toast, ToastContainer } from 'react-toastify'
import DatePicker from 'react-datepicker'

const DisburseLoanRequest = () => {
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
    const [fundingSources, setLoanFundingSources]= useState([])
    const [fundingSource, setFundingSource]= useState('')
    const {credentials} = useContext(UserContext)
    const navigate= useNavigate()
 

    const getLoanFundingSources=()=>{
        axios('RequestVerification/loan-funding-source-slim', {headers:{
            Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setLoanFundingSources(resp.data.data))
    }
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
        axios(`RequestVerification/get-loan-disbursement-detail?LoanApplicationNo=${id}`, {headers:{
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
        getLoanFundingSources()
    },[])

useEffect(()=>{
getProductDetails()
},[detail?.loanProduct])
 useEffect(()=>{
  getDetail()
 },[id])

const handleChange = (e) => {
  const { name, value } = e.target;

  setDetail((prevState) => ({
    ...prevState,
    productOtherDetail: {
      ...prevState.productOtherDetail,
      [name]: value,
    },
  }));
};

const disburseLoan=(e)=>{
    e.preventDefault()
    const payload={
            loanApplicationNo: id,
            customerId: detail.customerId,
            group: detail.group,
            loanProduct: detail.loanProduct,
            loanFundingSource: fundingSource,
            branch: detail.branch,
            loanAmount: detail.loanAmount,
            loanRate: detail?.productOtherDetail?.loanRate,
            term: detail.term,
            frequency: detail.frequency,
            noOfDays: detail.noOfDays,
            postingDate: detail.postingDate,
            calculationMethod: detail.productOtherDetail.calculationMethod,
            repaymentType: detail.productOtherDetail.repaymentType,
            collateralValue: detail.productOtherDetail.collateralValue,
            collateralType: detail.productOtherDetail.collateralType,
            drawDownDate: detail.drawDownDate,
            startDate: detail.startDate,
            firstPaymentDate: detail.firstPaymentDate,
            maturityDate: detail.maturityDate,
            loanSource: detail.loanSource,
            collateralDetail: detail.productOtherDetail.collateralDetail,
            lendingModel:detail.productOtherDetail.lendingModel,
            loanPurpose: detail.loanPurpose,
            gaurators: [
              detail.guarantors
            ]
    }
    axios.post('RequestVerification/loan-application', payload, {headers:{
        Authorization:`Bearer ${credentials.token}`
    }}).then(resp=>{
        setTimeout(() => {
            navigate(-1)
        }, 5000);
        toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
    })
    .catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}


  return (
    <form onSubmit={disburseLoan}>
    <div className='card rounded-4' style={{border:'solid 1px #fafafa'}}>
        <div className="py-4 px-3">
        <p onClick={()=>navigate(-1)} style={{cursor:'pointer', width:'fit-content'}}><BsArrowLeft/> Disburse Loan</p>
        <div className="admin-task-forms mx-1">
              <div
                className="d-flex flex-column gap-2 pb-3 px-0"
                style={{ boxShadow: "3px 3px 3px 3px #ddd", borderRadius:'10px 10px 0 0' }}
              >
                <div style={{ backgroundColor: "#EDF4FF", paddingTop: "10px", paddingInline:'15px',
                   borderRadius:'10px 10px 0 0' }}>
                  <p>Product Info</p>
                </div>
            <div className="mt-3">
            <div className="d-flex flex-wrap gap-2 justify-content-between px-3 mb-2">
                <div className="d-flex gap-3 discourse">
                  <span>Account Name:</span>
                  <p>{product?.productName}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3 discourse">
                    <span >Product Currency:</span>
                  <p>{product?.currencymne}</p>
                  </div>
                </div>
            </div>

            <div className="d-flex flex-wrap gap-2 justify-content-between px-3 mb-2">
                <div className="d-flex gap-3 discourse">
                  <span>Product Start Date:</span>
                  <p>{product?.productStart}</p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-3 discourse">
                    <span >Product Start Date:</span>
                  <p>{product?.productExpire}</p>
                  </div>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center px-3 flex-wrap">
                <div className="d-flex gap-3 discourse">
                <span style={{fontSize:'14px'}}>Min. Loan Amount:</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(product?.minAmt)}</p>
                  </div>
                
                <div className="d-flex gap-3 discourse">
                    <span style={{fontSize:'14px'}}>Max. Loan Amount:</span>
                    <p>{new Intl.NumberFormat('en-US',
                         {minimumFractionDigits:2}).format(product?.maxAmt)}</p>
                </div>
            </div>
          
                <div className="d-flex justify-content-between align-items-center px-3 mb-2 flex-wrap">
                <div className="d-flex gap-3 discourse">
                    <span style={{fontSize:'14px'}}>Min. Interest Rate:</span>
                    <p >{product?.minIntrate}</p>
                    </div>
                <div className="d-flex gap-3 discourse">
                <span style={{fontSize:'14px'}}>Max. Interest Rate:</span>
                    <p>{product?.maxIntrate}</p>
                </div>
            </div>
            
                <div className="d-flex justify-content-between align-items-center flex-wrap px-3 mb-2" style={{fontSize:'14px'}}>
                <div className="d-flex gap-3 discourse">
                    <span >Calc. Method:</span>
                    <p >{product?.loanCalc}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                    <span >Default Repayment Type:</span>
                    <p >{product?.repayDesc}</p>
                </div>
            </div>
            <div className="d-flex gap-3 discourse px-3">
                    <span style={{fontSize:'14px'}}>Collateral Value:</span>
                    <span>{product?.collateralvalue?.toLocaleString('en-US')}</span>
                </div>
            </div>
        </div>

        <div className="d-flex flex-column gap-2 pb-3 px-0"
        style={{ boxShadow: "3px 3px 3px 3px #ddd", borderRadius:'10px 10px 0 0' }}>
                <div style={{ backgroundColor: "#FEF3E6", paddingTop: "10px", paddingInline:'15px',
                     borderRadius:'10px 10px 0 0' }}>
                  <p> Account Info</p>
                </div>

                <div className="d-flex justify-content-between align-items-center px-3 flex-wrap">
            <div className="d-flex gap-3 discourse">
                    <span style={{fontSize:'14px'}}>Account Name:</span>
                    <p className='text-capitalize'>{detail?.accountInfo?.accountName}</p>
            </div>
            <div className="d-flex gap-3 discourse">
            <span style={{fontSize:'14px'}}>Account Number:</span>
                    <p >{detail?.accountInfo?.accountNumber}</p>
                </div>
               </div>
                <div className="d-flex justify-content-between align-items-center px-3 mb-2 flex-wrap">
            <div className="d-flex gap-3 discourse">
                    <span style={{fontSize:'14px'}}>Product Name:</span>
                    <span >
                        {detail?.productName}</span>
                </div>
            <div className="d-flex gap-3 discourse">
            <span style={{fontSize:'14px'}}>Branch:</span>
                    <span>{detail?.accountInfo?.branch}</span>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center px-3 flex-wrap">
            <div className="d-flex gap-3 discourse">
            <span style={{fontSize:'14px'}}>Book Balance:</span>
                    <p >{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(detail?.accountInfo?.bookBalance)}</p>
                </div>
            <div className="d-flex gap-3 discourse">
            <span style={{fontSize:'14px'}}>Usable balance:</span>
                <p >{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(detail?.accountInfo?.usableBalance)}</p>
            </div>
            </div>
            
        <div className="d-flex justify-content-between align-items-center px-3 flex-wrap">
            <div className="d-flex gap-3 discourse">
            <span style={{fontSize:'14px'}}>Effective Balance:</span>
                    <p >{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(detail?.accountInfo?.effectiveBalance)}</p>
                    </div>
            <div className="d-flex gap-3 discourse">
            <span style={{fontSize:'14px'}}>Account Status:</span>
                    <p >{detail?.accountInfo?.accountStatus}</p>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center px-3 flex-wrap">
            <div className="d-flex gap-3 discourse">
            <span style={{fontSize:'14px'}}>Source Type:</span>
                    <p >{detail?.accountInfo?.sourceType}</p>
            </div>
                <div className="d-flex gap-3 discourse">
                    <span style={{fontSize:'14px'}}>Source:</span>
                    <p >{detail?.accountInfo?.source}</p>
                </div>
            </div>
            </div>
            </div>     
      <div className="admin-task-forms mt-3">
        <div className="d-flex flex-column gap-1">
            <label htmlFor="customerId">Customer ID</label>
            <input type="text" name='customerId' value={detail?.customerId} disabled/>
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
            <label htmlFor="accountNumber">Settlement Account</label>
            <select type="text" name='fundingSource' required onChange={(e)=>setFundingSource(e.target.value)}>
                <option value="">Select</option>
            {
            fundingSources.map(source=>(
            <option value={source.glNumber} key={source.glNumber}>{source.acctName}</option>
            ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="loanProduct">Loan Product</label>
            <select type="text" disabled value={detail?.loanProduct} onChange={handleChange}>
            <option value="">Select</option>
            {
                products.map(product=>(
                    <option value={product.productCode} key={product.productCode}>{product.productName}</option>
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
            <input type="text"  name='loanRate' disabled
             value={detail?.productOtherDetail?.loanRate} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="firstPaymentDate">First Payment Date</label>
            <DatePicker
                          selected={
                            detail?.firstPaymentDate
                              ? new Date(detail?.firstPaymentDate)
                              : null
                          }
                          onChange={(date) =>
                            handleChange({
                              target: { name: "firstPaymentDate", value: date },
                            })
                          }
                          className="w-100"
                          dateFormat="dd-MM-yyy"
                        />
            
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
            <label htmlFor="noOfDays">Days</label>
            <input type="text" name='noOfDays' disabled value={detail?.noOfDays} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="lendingModel">Lending Model</label>
            <select type="text" name='lendingModel' onChange={handleChange} value={detail?.productOtherDetail?.lendingModel}>
            <option value="">Select</option>
            {
                models.map(model=>(
                    <option value={model.lendingCode} key={model.lendingCode}>{model.lendingName}</option>
                ))
            }
            </select>
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="postingDate">Posting Date</label>
             <DatePicker
                          selected={
                            detail?.postingDate
                              ? new Date(detail?.postingDate)
                              : null
                          }
                          onChange={(date) =>
                            handleChange({
                              target: { name: "postingDate", value: date },
                            })
                          }
                          className="w-100"
                          dateFormat="dd-MM-yyy"
                    
             />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="chargeConcession">Charge Concession</label>
            <input type="text" name='chargeConcession' onChange={handleChange} value={detail?.chargeConcession} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="calculationMethod">Calc. Method</label>
            <select type="text" name='calculationMethod'
             onChange={handleChange} value={detail?.productOtherDetail?.calculationMethod}>
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
            <select type="text" name='repaymentType' onChange={handleChange} 
            value={detail?.productOtherDetail?.repaymentType}>
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
            <input type="text" name='collateralDetail'
             onChange={handleChange} value={detail?.productOtherDetail?.collateralDetail} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="loanSource">Loan Source</label>
            <select type="text" name='loanSource' onChange={handleChange} value={detail?.productOtherDetail?.loanSource}>
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
            <input type="text" name='collateralValue' disabled
             value={detail?.productOtherDetail?.collateralValue} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="lienAmount">percentage Lien %</label>
            <input type="text" name='lienAmount' onChange={handleChange} value={detail?.lienAmount} />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="startDate">Start Date</label>
             <DatePicker
                          selected={
                            detail?.startDate
                              ? new Date(detail?.startDate)
                              : null
                          }
                          onChange={(date) =>
                            handleChange({
                              target: { name: "startDate", value: date },
                            })
                          }
                          className="w-100"
                          dateFormat="dd-MM-yyy"
                        />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="lienAmount">Lien Amount</label>
            <input type="text" disabled name='lienAmount' value={detail?.lienAmount} onChange={handleChange}  />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="drawDownDate">Draw down Date</label>
             <DatePicker
                          selected={
                            detail?.drawDownDate
                              ? new Date(detail?.drawDownDate)
                              : null
                          }
                          onChange={(date) =>
                            handleChange({
                              target: { name: "drawDownDate", value: date },
                            })
                          }
                          className="w-100"
                          dateFormat="dd-MM-yyy"
                        />
        </div>
        <div className="d-flex flex-column gap-1">
            <label htmlFor="loanPurpose">Narration</label>
            <input type="text" name='loanPurpose' value={detail?.loanPurpose} onChange={handleChange}  />
        </div>
      </div>
      </div>
      <div className="d-flex gap-3 mt-4 align-items-center justify-content-end p-3"
       style={{backgroundColor:'#f2f2f2', borderRadius:'0 0 15px 15px'}}>
        <button className="btn-md rounded-5 px-3 border-0 py-2" type='reset'>Reset</button>
        <button className="btn-md member border-0" type='submit'>Submit</button>
      </div>
    </div>
    
      <ToastContainer/>
    </form>

  )
}

export default DisburseLoanRequest
