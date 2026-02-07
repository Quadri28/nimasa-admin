import React,{useState, useContext, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../../AuthContext'
import { NumericFormat } from 'react-number-format'
import axios from '../../axios'
import { BsArrowLeft } from 'react-icons/bs'
import { toast, ToastContainer } from 'react-toastify'
import DatePicker from 'react-datepicker'



const EditSavings = () => {
    const {savingCode} = useParams()
    const [products, setProducts]= useState([])
    const [savings, setSavings]= useState({
  productCode: "",
  productName: "",
  productType: "",
  productStart: "",
  productExpire: "",
  currencyCode: "",
  openBalance: 0,
  closeBalance: 0,
  minintbalance: 0,
  drrate: 0,
  crrate: 0,
  withAllowed: 0,
  stateInactive: 0,
  checkBook: 0,
  sweepIn: 0,
  si: 0,
  od: 0,
  yrProcessMethod: 0,
  siFloor: 0,
  penalRate: 0,
  productShort: "",
  lien: 0,
  dailyInterest: 0,
  interBranch: "",
  maximumAmount: 0
    })
    const [types, setTypes] = useState([])
    const [currencies, setCurrencies] = useState([])
      const [classes, setClasses] = useState([])
    const {credentials}= useContext(UserContext)
    const getSavings=()=>{
      axios(`SavingProduct/get-saving-product-by-code?savingCode=${savingCode}`, {headers:{
        Authorization: `Bearer ${credentials.token}`
      }}).then((resp)=>{
        setSavings(resp.data.data)
      })
    }
    const navigate = useNavigate()
     const getClasses=()=>{
        axios('SavingProduct/get-saving-product-class', {headers:{
          Authorization: `Bearer ${credentials.token}`
        }}).then(resp=>setClasses(resp.data.data))
      }
    const getTypes=()=>{
      axios('Common/getproducttype')
      .then((resp)=>setTypes(resp.data))
    }
  const getCurrencies=()=>{
    axios('Common/get-currencies')
    .then((resp)=>setCurrencies(resp.data))
  }
  const getSavingProducts=()=>{
    axios('SavingProduct/get-saving-products', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      setProducts(resp.data.data)
    })
  }
    useEffect(()=>{
      getSavings()
      getSavingProducts()
      getTypes()
      getClasses()
      getCurrencies()
    }, [])
const handleChange = (event) => {
  if (event instanceof Date) {
    setSavings((prev) => ({ ...prev, productStart: event }));
  } else {
    const { name, value, type, checked } = event.target;
    const finalValue = type === 'checkbox' ? checked : value;
    setSavings((prev) => ({ ...prev, [name]: finalValue }));
  }
};

const handleSubmit =(e)=>{
  e.preventDefault()
  const payload={
  productCode: savings.productCode,
  productName: savings.productName,
  productType: savings.productType,
  productClass: String(savings.productClass),
  productStart: savings.productStart,
  productExpire: savings.productExpire,
  currencyCode: savings.currencyCode,
  openBalance: savings.openBalance,
  closeBalance: savings.closeBalance,
  minintbalance: savings.minintbalance,
  drrate: savings.drrate,
  crrate: savings.crrate,
  withAllowed: savings.withAllowed,
  stateInactive: savings.stateInactive,
  checkBook: savings.checkBook,
  sweepIn: savings.sweepIn,
  si: savings.si,
  od: savings.od,
  yrProcessMethod: savings.yrProcessMethod,
  siFloor: savings.siFloor,
  penalRate: savings.penalRate,
  productShort: savings.productShort,
  lien: savings.lien,
  dailyInterest: savings.dailyInterest,
  interBranch: savings.interBranch,
  maximumAmount: savings.maximumAmount,
  lockSaving: savings.lockSaving
  }
  axios.post('SavingProduct/update-saving-product', payload, {headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
    setTimeout(()=>{
      navigate(-1)
    }, 5000)
  }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}

    return (
      <div className="rounded-4" style={{border:'solid .5px #f2f2f2'}}>
        <div
          className="justify-content-center p-3"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "8px 8px 0 0" }}
        >
          <div className="d-flex gap-2 align-items-center">
            <BsArrowLeft
              style={{ fontSize: "20px", cursor: "pointer" }}
              onClick={() => navigate(-1)}
            />
            Edit saving product
          </div>
        </div>
        <form className="bg-white pt-2" onSubmit={handleSubmit} style={{borderRadius:' 0 0 15px 15px'}}>
          <div className="px-4 admin-task-forms">
            <div className="row g-2">
              <label htmlFor="productCode" style={{ fontWeight: "500" }}>
                Product Code:
              </label>
              <select
                name="productCode"
                id="productCode"
                value={savings?.productCode}
                onChange={handleChange}
              >
              <option value="">Select product</option>
              {
                products.map(product=>(
                  <option value={product.productCode} key={product.productCode}>{product.productName}</option>
                ))
              }
              </select>
            </div>
            <div className="row g-2">
              <label htmlFor="productClass" style={{ fontWeight: "500" }}>
                Product Class:
              </label>
              <select
                name="productClass"
                id="productClass"
                value={savings?.productClass}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {
                  classes.map(clas=>(
                    <option value={clas.moduleCode} key={clas.moduleCode}>{clas.moduleDesc}</option>
                  ))
                }
              </select>
            </div>
            <div className="row g-2">
              <label htmlFor="productStart" style={{ fontWeight: "500" }}>
                Product Start: 
              </label>
             <DatePicker
                        selected={
                          savings?.productStart && !isNaN(Date.parse(savings.productStart))
                            ? new Date(savings.productStart)
                            : null
                        }
                           onChange={(date) =>
                             handleChange({
                               target: { name: "productStart", value: date },
                             })
                           }
                           className="w-100"
                           dateFormat="dd-MM-yyyy"
                         />
            </div>
            <div className="row g-2">
              <label htmlFor="expiryDate" style={{ fontWeight: "500" }}>
                Expiry Date:
              </label>
              <DatePicker
                        selected={
                          savings?.productExpire && !isNaN(Date.parse(savings.productStart))
                            ? new Date(savings.productExpire)
                            : null
                        }
                           onChange={(date) =>
                             handleChange({
                               target: { name: "productExpire", value: date },
                             })
                           }
                           className="w-100"
                           dateFormat="dd-MM-yyyy"
                         />
            </div>
            <div className="row g-2">
              <label htmlFor="openBalance" style={{ fontWeight: "500" }}>
                Opening Balance:
              </label>
              <input
                name="openBalance"
                id="openBalance"
                value={savings?.openBalance}
                onChange={handleChange}
              />
            </div>
            <div className="row g-2">
              <label htmlFor="closeBalance" style={{ fontWeight: "500" }}>
                Close Balance:
              </label>
              <input
                name="closeBalance"
                id="closeBalance"
                value={savings?.closeBalance}
                onChange={handleChange}
              />
            </div>
            <div className="row g-2">
              <label htmlFor="productType" style={{ fontWeight: "500" }}>
                Product Type:
              </label>
              <select
                name="productType"
                id="productType"
                value={savings?.productType}
                onChange={handleChange}
              >
              <option value="">Select</option>
              {
                types.map((type)=>(
                  <option value={type.productTypeId} key={type.productTypeId}>{type.productTypeDesc}</option>
                ))
              }
              </select>
            </div>
            <div className="row g-2">
              <label htmlFor="currencyCode" style={{ fontWeight: "500" }}>
                Currency:
              </label>
              <select
                name="currencyCode"
                id="currencyCode"
                value={savings?.currencyCode}
                onChange={handleChange}
              >
                <option value="">Select</option>
              {
                currencies.map((currency)=>(
                  <option value={currency.countryCode} key={currency.countryCode}>
                    {currency.currencyName}
                  </option>
                ))
              }
              </select>
            </div>
            <div className="row g-2">
              <label htmlFor="minimumInterestBalance" style={{ fontWeight: "500" }}>
              Minimum Interest Balance:
              </label>
              <input
                name="minimumInterestBalance"
                id="minimumInterestBalance"
                value={savings?.minimumInterestBalance}
                onChange={handleChange}
              />
            </div>
            <div className="row g-2">
              <label htmlFor="crRate" style={{ fontWeight: "500" }}>
                Credit Interest Rates:
              </label>
              <input
                name="crrate"
                value={savings?.crrate}
                onChange={handleChange}
              />
            </div>
            <div className="row g-2">
              <label htmlFor="drrate" style={{ fontWeight: "500" }}>
                Debit Interest Rates:
              </label>
              <input
                name="drrate"
                id="drrate"
                value={savings?.drrate}
                onChange={handleChange}
              />
            </div>
            <div className="row g-2">
              <label htmlFor="productCode" style={{ fontWeight: "500" }}>
                Interest Calculation Basis:
              </label>
              <input
                name="interestCalc"
                id="productCode"
                value={savings?.productCode}
                onChange={handleChange}
              />
            </div>
            <div className="row g-2">
              <label htmlFor="productCode" style={{ fontWeight: "500" }}>
                Interest Days:
              </label>
              <input
                name="dailyInterest"
                id="dailyInterest"
                value={savings?.dailyInterest}
                onChange={handleChange}
              />
            </div>
            <div className="row g-2">
              <label htmlFor="productCode" style={{ fontWeight: "500" }}>
                Max. Withdrawal (Allowed for interest):
              </label>
              <input
                name="maximumAmount"
                id="maximumAmount"
                value={savings?.maximumAmount}
                onChange={handleChange}
              />
            </div>
          </div>
           <span style={{ fontWeight: "500" }} className="px-4 mt-3">Others</span>
                      <div className="general-ledger px-4 mt-2 mb-4">
                          <label
                            htmlFor="others"
                            className="d-flex align-items-center gap-2"
                          >
                            <input
                              name="checkBook"
                              id="checkBook"
                              type="checkbox"
                              checked={savings?.checkBook}
                             onChange={handleChange}
                            />{" "}
                            Allow cheque book
                          </label>
                           <label
                            htmlFor="others"
                            className="d-flex align-items-center gap-2"
                          >
                            <input
                              name="lockSaving"
                              type="checkbox"
                             checked={savings?.lockSaving}
                             onChange={handleChange}
                            />
                            Lock withdrawal
                          </label>
                          <label
                            htmlFor="others"
                            className="d-flex align-items-center gap-2"
                          >
                            <input
                              name="si"
                              type="checkbox"
                              checked={savings?.si}
                             onChange={handleChange}

                            />
                            Allow standing instructions
                          </label>
                          <label
                            htmlFor="others"
                            className="d-flex align-items-center gap-2"
                          >
                            <input
                              name="od"
                              type="checkbox"
                              checked={savings?.od}
                             onChange={handleChange}
                            />
                            Allow OD
                          </label>
                          <label
                            htmlFor="others"
                            className="d-flex align-items-center gap-2"
                          >
                            <input
                              name="sweepIn"
                              checked={savings?.sweepIn}
                              type="checkbox"
                             onChange={handleChange}
                            />{" "}
                            Allow Sweep in
                          </label>
                          <label
                            htmlFor="lien"
                            className="d-flex align-items-center gap-2"
                          >
                            <input
                              name="lien"
                              checked={savings?.lien}
                              type="checkbox"
                              onChange={handleChange}
                            />{" "}
                            
                            Allow Lien
                          </label>
                          <label
                            htmlFor="stateInactive"
                            className="d-flex align-items-center gap-2"
                          >
                            <input
                              name="stateInactive"
                              type="checkbox"
                              checked={savings?.stateInactive}
                             onChange={handleChange}
                            />{" "}
                            Stat to all Inactive/ Dormant A/C
                          </label>
                      </div>
          <div className="d-flex gap-3 justify-content-end px-4 py-3 mt-4"
           style={{backgroundColor:'#f2f2f2', borderRadius:' 0 0 15px 15px'}}>
            <button className='member border-0 btn-md'>Submit</button>
          </div>
        </form>
        <ToastContainer/>
      </div>
  )
}

export default EditSavings
