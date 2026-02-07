import React,{useState, useEffect, useContext, useMemo} from "react";
import axios from "../../axios";
import { Multiselect } from "react-widgets";
import { CiSearch } from "react-icons/ci";
import Modal from 'react-modal'
import useScreenSize from "../../ScreenSizeHook";
import { BsArrowLeft } from "react-icons/bs";
import { LiaTimesCircle } from "react-icons/lia";
import GeneralLedgerTable from "./ProductSettingComponent/GeneralLedgerTable";
import { UserContext } from "../../AuthContext";


const EditCooperativeLoanFormTwo = ({ handleChange, details, setDetails }) => {
  const {credentials}= useContext(UserContext)
  const [loanClasses, setLoanClasses] = useState([])
  const [repaymentTypes, setRepaymentTypes] = useState([])
  const [loanRepayments, setLoanRepayments]=useState([])
  const [methods, setMethods]= useState([])
  const [productCharges, setProductCharges]= useState([])
  const [options, setOptions] = useState([])
  const [glTypes, setGlTypes] = useState([]);
  const [glNodes, setGlNodes] = useState([]);
  const [glClasses, setGlClasses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [gl, setGl]= useState(null)
  const [modalShow, setModalShow]= useState(false)
  const [input, setInput]= useState({})
  const [accountSelector, setAccountSelector]= useState('')
  
  

  const { width } = useScreenSize();
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      height: "65%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "1rem",
      width: width > 900 ? "800px" : "320px",
      overFlowY: "scroll",
      padding: 0,
      border:'solid 1px #f2f2f2'
    },
  };
  const getLoanClasses =()=>{
    axios('Common/getloanclass')
    .then((resp)=>setLoanClasses(resp.data))
  }

  const getMethods=()=>{
    axios('Common/calculation-method')
    .then((resp)=>setMethods(resp.data))
  }
  const getPenalOption=()=>{
    axios('Common/penal-option')
    .then(resp=>setOptions(resp.data))
  }
  const getRepaymentTypes=()=>{
    axios('Common/principal-repayment-type')
    .then((resp)=>setRepaymentTypes(resp.data))
  }
  const getProductCharges =()=>{
    axios('Common/getcharges')
    .then((resp)=>setProductCharges(resp.data))
  }
  const fetchLoanRepaymentTypes= async()=>{
    await axios('Common/getloanrepayments')
    .then(resp=>setLoanRepayments(resp.data))
  }
  useEffect(()=>{
    getLoanClasses()
    getRepaymentTypes()
    getProductCharges()
    getMethods()
    getPenalOption()
    fetchLoanRepaymentTypes()
  },[])

  const handleIconClick = (glName) => {
    setGl(glName);  // Store the selected GL category name
    setModalShow(true);
  };

  const handleClose = () => {
    if (gl) { 
      setDetails(prevDetails => ({
        ...prevDetails,
        [gl]: accountSelector  // Update the specific GL category input field
      }));
    }
    setModalShow(false);
  };

 
  const glCategories = [
    { name: "principalBalance", label: "Principal Balance", value:'' },
    { name: "suspinterest", label: "Suspended Interest", value:''},
    { name: "interestReceivable", label: "Interest Receivable", value:'' },
    { name: "interestIncome", label: "Interest Income", value:'' },
    { name: "interestAccrual", label: "Interest Accrual", value:'' },
    { name: "interBranchGL", label: "InterBranch GL", value:'' },
    { name: "suspPrincipal", label: "Suspended Principal", value:'' },
    { name: "unearnedIncomeGL", label: "Unearned Income", value:'' },
    { name: "miscIncome", label: "Miscellaneous Income", value:'' },
  ];
 


  //Modal contents handling
  const changeHandler =(e)=>{
    const name= e.target.name;
    const value= e.target.value;
    setInput({...input, [name]:value})
  }

   const fetchGlTypes = async () => {
    await axios.get("GlAccount/gl-type", {
          headers: { Authorization: `Bearer ${credentials.token}` },
        }).then(resp=>setGlTypes(resp.data));
    }
  
    const fetchGlNodes = async () => {
   await axios.get(
          `GlAccount/gl-type-node?prodTypeCode=${input.glType}`,
          {
            headers: { Authorization: `Bearer ${credentials.token}` },
          }
        ).then(resp=>setGlNodes(resp.data.data))
    };
  
    const fetchNodeClasses = () => {
      axios(
        `GlAccount/gl-type-class?glTypeNodeCode=${input.glNode}`,
        {
          headers: { Authorization: `Bearer ${credentials.token}` },
        }
      ).then((resp) => {
        setGlClasses(resp.data.data)
      });
    };
  
    const fetchGlAccounts = () => {
      axios(
        `LoanProduct/gl-account-number?glClass=${input.glClass}`,
        {
          headers: { Authorization: `Bearer ${credentials.token}` },
        }
      ).then((resp) => {
        setAccounts(resp.data.data)
    })
    };
  
    useEffect(() => {
      fetchGlTypes();
    }, []);
  
    useEffect(() => {
          fetchGlNodes();
    }, [input.glType]);
  
    useEffect(() => {
        fetchNodeClasses();
    }, [input.glNode]);
  
    useEffect(() => {
        fetchGlAccounts();
    }, [input.glClass]);

  const column = [
      {Header: 'Select', accessor:'', Cell: (({cell})=>{
        const acctNumber=  cell.row.original.glNumber
        return  <div className="d-flex justify-content-center align-items-center">
        <input type="radio" name="accountSelector"   onChange={()=>{
          setAccountSelector(acctNumber)
          }}/>
        </div>
      })},
      {Header: 'Gl acct No', accessor:'glNumber'},
      {Header: 'Acct title', accessor:'accountName'},
      {Header: 'Branch office', accessor:'branch'},
      {Header: 'Date opened', accessor:'dateOpened'},
      {Header: 'Bk balance', accessor:'bookBalance', Cell:(({value})=>{
        return <span>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(value)}</span>
      })},
    
    ]
  
      const columns = useMemo(() => column, []);
  return (
    <>
    <div className="px-4 admin-task-forms">
        <div className="row g-2">
                      <label htmlFor="repaymentMethod" style={{ fontWeight: "500" }}>
                        Repayment Types<sup className="text-danger">*</sup>
                      </label>
                      <select name="repaymentMethod" value={details?.repaymentMethod} onChange={handleChange}>
                        <option value="">Select</option>
                        {loanRepayments.map((type) => (
                          <option value={type.repayId} key={type.repayId}>
                            {type.repayDesc}
                          </option>
                        ))}
                      </select>
        </div>
    <div className="row g-2">
      <label htmlFor="penalize" style={{ fontWeight: "500" }}>
        Penalty Rate :
      </label>
      <input name="penaltyRate" value={details?.penaltyRate} 
      onChange={handleChange}/>
    </div>
    <div className="row g-2">
      <label htmlFor="loanClass" style={{ fontWeight: "500" }}>
        Loan Class 
      </label>
      <select name="loanClass" id="loanClass" value={details?.loanClass} onChange={handleChange}>
        <option value="">Select</option>
        {
          loanClasses.map((loanClass)=>(
            <option value={loanClass.code} key={loanClass.code}>{loanClass.loandesc}</option>
          ))
        }
        </select>
    </div>
    <div className="row g-2">
      <label htmlFor="collateralValue" style={{ fontWeight: "500" }}>
        Collateral Value :
      </label>
      <input name="collateralValue" id="collateralValue" type="number" 
      value={details?.collateralValue} onChange={handleChange}/>
    </div>
    <div className="row g-2">
      <label htmlFor="calcmethod" style={{ fontWeight: "500" }}>
        Calculation Method :
      </label>
      <select name="calcmethod" value={details?.calcmethod}
       onChange={handleChange} > 
      <option value="">Select</option>
      {
        methods.map((method)=>(
          <option value={method.value} key={method.value}>{method.name}</option>
        ))
      }
      </select>
    </div>
    <div className="row g-2">
      <label htmlFor="repaymentType" style={{ fontWeight: "500" }}>
       Interest Repayment Types:
      </label>
      <select name="repaymentType"  onChange={handleChange} value={details.repaymentType} > 
      <option value="">Select</option>
      {
        repaymentTypes.map((type)=>(
          <option value={type.value} key={type.value}>
            {type.name}
          </option>
        ))
      }
      </select>
    </div>
    <div className="row g-2">
      <label htmlFor="repaymentType2" style={{ fontWeight: "500", fontSize:'14px' }}>
        Principal repayment type :
      </label>
      <select name="repaymentType2" id="repaymentType2" 
      onChange={handleChange} value={details.repaymentType2} > 
      <option value="">Select</option>
      {
        repaymentTypes.map((type)=>(
          <option value={type.value} key={type.value}>
            {type.name}
          </option>
        ))
      }
      </select>
    </div>
    <div className="row g-2">
      <label htmlFor="penalOptions" style={{ fontWeight: "500" }}>
     Penal Options :
      </label>
      <select name="penalize"  value={details.penalize} onChange={handleChange}> 
        <option value="">Select</option>  
       {
        options.map((option)=>(
          <option value={option.value} key={option.value}>{option.name}</option>
        ))
       }
      </select>
    </div> <div></div>
    </div>
  <div className="row g-2 px-3">
                <label htmlFor="productCharges" style={{ fontWeight: "500" }}>
                  Product Charges <sup className="text-danger">*</sup>
                </label>
                <Multiselect
                 data={productCharges}
                 textField='chargeDesc'
                value={productCharges.filter(pc =>
                  details?.productCharges?.some(selected => selected.chargeCode === pc.chargeCode))}
                  onChange={(value) => {
                    setDetails((prev) => ({
                      ...prev,
                      productCharges: value,
                    }));
                  }}
                 />
       </div>
          <div className="px-3">
              <div className="admin-task-forms">
              <span style={{ fontWeight: "500" }}>
                General Ledger
              </span> <div></div>
              {
                glCategories.map(category=>{
                   
                  return  <div className="d-flex flex-column gap-1">
                    <label className="">{category.label}</label>
                    <div style={{position:'relative'}} >
                    <CiSearch size={20} style={{position:'absolute', cursor:'pointer', right:'0%', 
                      top:'50%', transform:'translate(-50%, -50%)'}}  
                      onClick={() => handleIconClick(category.name)}/>
                    <input type="text" name={category.name} className="w-100"
                       value={details[category.name] || ""}   
                        onChange={(e) => {
                        const name = category.name;
                        const value = e.target.value;
                        setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
                      }}
                       />
                    </div>
                  </div>
                })
              }
            </div>
            {/* Modal to get gl Account */}
            <Modal
            isOpen={modalShow}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
            >
             <div style={{backgroundColor:'#F5F9FF', borderRadius:'15px  15px 0 0',
               padding:'15px 20px'}} >
                <div className="d-flex justify-content-between">
                <div>
             <BsArrowLeft/> <span style={{fontSize:'14px', fontWeight:'400', color:'#4D4D4D'}}>
              </span>General ledger enquiry
             </div>
             <LiaTimesCircle onClick={()=>handleClose()} style={{cursor:"pointer"}}/>
             </div>
             </div>
             <div className="admin-task-forms px-3">
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glTypes">GL type</label>
                <select type="text" name="glType" onChange={changeHandler}>
                <option value="">Select</option>
                {
                  glTypes.map(type=>(
                    <option value={type.prodTypeCode} key={type.prodTypeCode}>{type.prodTypeName}</option>
                  ))
                }
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glNode">GL node</label>
                <select type="text" name="glNode" onChange={changeHandler}>
                <option value="">Select</option>
                {
                  glNodes?.map(node=>(
                    <option value={node.gl_NodeCode} key={node.gl_NodeCode}>{node.gl_NodeName}</option>
                  ))
                }
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glClass">GL class</label>
                <select type="text" name="glClass" onChange={changeHandler}>
                <option value="">Select</option>
                {
                  glClasses.map(clas=>(
                    <option value={clas.gl_ClassCode} key={clas.gl_ClassCode}>{clas.gl_ClassName}</option>
                  ))
                }
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="glAccount">GL account</label>
                <input name="glAccount" value={accountSelector} />
              </div>
             </div>
             <div className="px-3 my-2">
             <GeneralLedgerTable
             data={accounts}
             columns={columns}/> 
            </div>
            <div className="d-flex justify-content-end px-3 mb-4">
            <button onClick={()=>{
            handleClose()
            }} className="member border-0 btn-md">Proceed</button>
            </div>
            </Modal>
            </div>
  </>
  )
}
export default EditCooperativeLoanFormTwo;
