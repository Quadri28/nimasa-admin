import React,{useState, useContext, useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../../AuthContext'
import axios from '../../axios'
import ViewCooperativeLoanFormTwo from './ViewCooperativeLoanFormTwo'
import ViewCooperativeLoanFormOne from './ViewCooperativeLoanFormOne'
import { BsArrowLeft } from 'react-icons/bs'

const ViewLoanProduct = () => {
  const {productCode}= useParams()
  const [current, setCurrent] = useState('first')
  const [error, setError] = useState('')
  const [details, setDetails] = useState({
  productCode: "",
  productClass: "",
  productName: "",
  currencyCode: "",
  startDate: "",
  expiryDate: "",
  minAmount: 0,
  productType: "",
  loanFrequency: "",
  maxAmount: 0,
  shortName: "",
  numberOfGauratorRequired: 0,
  minimumInterestPerMonth: 0,
  maximumInterestPerMonth: 0,
  minTerm: 0,
  maxTerm: 0,
  interestRate: 0,
  loanRepaymentId: "",
  loanInterestRepaymentType: 0,
  calculationMethod: 0,
  loanType: 0,
  principalRepaymentType: 0,
  loanClass: 0,
  penalOption: 0,
  collateralValue: 0,
  penaltyRate: 0,
  allowODOnAccount: true,
  allowCommercialPapper: true,
  repaymentType: "",
  principalBal: "",
  interestReceivable: "",
  suspinterest: "",
  suspPrincipal: "",
  interestAccrual: "",
  unearnedIncomeGL: "",
  interestIncome: "",
  miscIncome: "",
  interBranchGL: ""
  })

  const getForms=()=>{
    if (current === 'first') {
      return <ViewCooperativeLoanFormOne details={details}/>
    }else if (current === 'second') {
      return <ViewCooperativeLoanFormTwo details={details}/>
    }
  }

  const navigate = useNavigate()

  const {credentials} = useContext(UserContext)

  const getProductDetails =()=>{
    axios(`LoanProduct/loan-product?productCode=${productCode}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }})
    .then((resp)=>{
      setDetails(resp.data.data)
    }).catch(error=>setError(error.message))
  }
  useEffect(()=>{
    getProductDetails()
  }, [])

  return (
    <>
    <div className='card rounded-4 mt-3' style={{border:'solid .5px #fafafa'}}>
      <div className="justify-content-center p-3"
        style={{ backgroundColor: "#f4fAfd", borderRadius: "15px 15px 0 0" }}>
          <div className='d-flex gap-1 align-items-center'>
           <BsArrowLeft style={{fontSize:'20px', cursor:'pointer'}} onClick={()=>navigate(-1)}/> 
           View Loan Product
          </div>
      </div>
      {
        getForms()
      }
       <div
          className="d-flex justify-content-end mt-3 p-3"
          style={{ backgroundColor: "#FAFAFA", borderRadius:'0 0 15px 15px' }}
        >
          {current ==='second' &&
          (<button className="px-3 btn-md" type="reset" 
          onClick={()=>setCurrent('first')}>
            Previous
          </button>)}
          {current === 'first' && (<button
            className="btn btn-sm"
            style={{
              backgroundColor: "#0452c8",
              color: "#fff",
              padding: "8px 10px",
              borderRadius: "1.5rem",
            }}
            type="button"
            onClick={()=>setCurrent('second')}
          >
            Proceed
          </button>)}
        </div>
    </div>
</>
  )
}

export default ViewLoanProduct
