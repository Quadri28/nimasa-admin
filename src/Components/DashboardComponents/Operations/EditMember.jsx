import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import { BsArrowLeft } from "react-icons/bs";
import { NumericFormat } from "react-number-format";



const EditMember = () => {
  const [memberTypes, setMemberTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [states, setStates] = useState([]);
  const [residentStates, setResidentStates] = useState([]);
  const [towns, setTowns] = useState([]);
  const [idTypes, setIdTypes] = useState([]);
  const [titles, setTitles]= useState([])
  const [error, setError]= useState('')
  const [nationalities, setNationalities] = useState([]);
  const [details, setDetails] = useState({
    memberId: "",
    memberType: "",
    customId: "",
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "",
    dateJoined: "",
    nationality: "",
    stateOfOrigin: "",
    sector: "",
    title: "",
    residentState: "",
    residentTown: "",
    residentAddress: "",
    officeAddress: "",
    mobilePhone1: "",
    mobilePhone2: "",
    officePhone: "",
    emailAddress: "",
    identificationType: "",
    identificationNumber: "",
    bvn: "",
    nameOfNextOfKin: "",
    nextOfKinPhone: "",
    nextOfKinAddress: "",
    relationshipWithNextOfKin: "",
    hasLoginDetail: false,
    userName: "",
    accountBranch: "",
    accountProduct: "",
    accountDescription: "",
    monthlyContribution: 0,
    accountNumber: "",
    paymentBank: "",
    amount: 0,
    tellerNumber: "",
    referralName: "",
    referralPhoneNumber: "",
    referralAddress: "",
  });

  const { id } = useParams();
  const { credentials } = useContext(UserContext);
  const getMemberTypes = () => {
    axios("MemberManagement/member-type", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => {
      setMemberTypes(resp.data);
    });
  };
  const getTitles=()=>{
    axios('MemberManagement/get-title', {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then((resp)=>setTitles(resp.data.data))
  }
  const getSectors = () => {
    axios("MemberManagement/get-sector", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setSectors(resp.data.data));
  };
  const getProducts = () => {
    axios("MemberManagement/get-products", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setProducts(resp.data.data));
  };
  const getIdTypes = () => {
    axios("MemberManagement/get-identification-type", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setIdTypes(resp.data.data));
  };
  const getResidentStates = () => {
    axios("MemberManagement/get-states", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setResidentStates(resp.data.data));
  };
  const getStates = () => {
    axios("MemberManagement/get-states", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setStates(resp.data.data));
  };
  const getNationalities = () => {
    axios("MemberManagement/get-nationalities", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setNationalities(resp.data.data));
  };
  const getBranches = () => {
    axios("MemberManagement/get-branch", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBranches(resp.data.data));
  };

  const getGenders = () => {
    axios("MemberManagement/get-gender", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setGenders(resp.data.data));
  };
  const getTowns = () => {
    axios("MemberManagement/get-town", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setTowns(resp.data.data));
  };
  useEffect(() => {
    getMemberTypes();
    getGenders();
    getSectors();
    getBranches();
    getProducts();
  }, []);

  useEffect(() => {
    getNationalities();
    getStates();
    getTowns();
    getIdTypes();
    getTitles();
    getResidentStates();
  }, []);

  const fetchMember = () => {
    axios(`MemberManagement/get-member-by-unique-id?uniqueId=${id}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setDetails(resp.data.data));
  };
  useEffect(() => {
    fetchMember();
  }, []);
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setDetails({ ...details, [name]: value });
  };
  const editMember =(e) => {
    e.preventDefault();
    const payload= new FormData()
    payload.append('MemberId', details.memberId)
    payload.append('employeeId', details.memberId)
    payload.append('MemberType', details.memberType)
    payload.append('CustomId', details.customId ? details.customId : false)
    payload.append('FirstName', details.firstName)
    payload.append('LastName', details.lastName)
    payload.append('MiddleName', details.middleName)
    payload.append('DateOfBirth', new Date (details.dateOfBirth).toLocaleDateString('en-CA'))
    payload.append('Gender', details.gender)
    payload.append('DateJoined', new Date (details.dateJoined).toLocaleDateString('en-CA'))
    payload.append('Nationality', details.nationality)
    payload.append('StateOfOrigin', details.stateOfOrigin)
    payload.append('Sector', details.sector)
    payload.append('Title', details.title)
    payload.append('ResidentState', details.residentState)
    payload.append('Town', details.town)
    payload.append('ResidentAddress', details.residentAddress)
    payload.append('OfficeAddress', details.officeAddress)
    payload.append('MobilePhone1', details.mobilePhone1)
    payload.append('MobilePhone2', details.mobilePhone2)
    payload.append('OfficePhone', details.officePhone)
    payload.append('EmailAddress', details.emailAddress)
    payload.append('IdentificationType', details.identificationType)
    payload.append('IdentificationNumber', details.identificationNumber)
    payload.append('Bvn', details.bvn)
    payload.append('NextOfKinName', details.nameOfNextOfKin)
    payload.append('NextOfKinPhone', details.nextOfKinPhone)
    payload.append('NextOfKinAddress', details.nextOfKinAddress)
    payload.append('RelationshipWithNextOfKin', details.relationshipWithNextOfKin)
    payload.append('HasLoginDetail', details.hasLoginDetail)
    payload.append('UserName', details.userName)
    payload.append('UniqueId', details.uniqueId)
    payload.append('AccountBranch', details.accountBranch)
    payload.append('AccountProduct', details.accountProduct)
    payload.append('AccountDescription', details.accountDescription)
    payload.append('MonthlyContribution', details.monthlyContribution)
    payload.append('AccountNumber', details.accountNumber)
    payload.append('PaymentBank', details.paymentBank)
    payload.append('Amount',  details.amount)
    payload.append('TellerNumber', details.tellerNumber)
    payload.append('ReferralName', details.referralName)
    payload.append('ReferralPhoneNumber', details.referralPhoneNumber)
    payload.append('ReferralAddress', details.referralAddress)
    
    axios.post("MemberManagement/edit-member-registration", payload, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then(resp=>{
      toast(resp.data.message,
     {type:'success', pauseOnHover:true, autoClose:3000})
     setTimeout(() => {
      navigate(-1)
     }, 5000);
    })
    .catch((error) => {
  const errors = error.response?.data?.errors || [];
  
  errors.forEach((err) => {
    toast.error(err.message, {
      autoClose: 5000,
      pauseOnHover: true,
    });
  });

});
  };
  const navigate = useNavigate()
  return (
    <div className="card rounded-4" style={{border:'solid .2px #F2F2F2'}}>
       <div className="d-flex gap-2 p-3  align-items-center" 
       style={{backgroundColor:'#f4fAfd', borderRadius:'15px 15px 0 0', cursor:'pointer'}}>
       <BsArrowLeft onClick={()=>navigate(-1)}/>
        <span>Edit Member Details:</span>
        </div>
       <form onSubmit={editMember}>
       <div className="p-3"> 
       { error ? <span className="text-danger">{}</span>: null}
      <div className="admin-task-forms">
        <div className="custom-input-wrapper">
          <label htmlFor="memberId">
            Member ID<sup className="text-danger">*</sup>
          </label>
          <input name="memberId" value={details?.memberId} onChange={handleChange} required/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="firstName">
            First Name<sup className="text-danger">*</sup>
          </label>
          <input name="firstName"
           value={details?.firstName} onChange={handleChange} required/>
        </div> 
        <div className="custom-input-wrapper ">
          <label htmlFor="lastName">
            Last Name<sup className="text-danger">*</sup>
          </label>
          <input name="lastName"  value={details?.lastName} onChange={handleChange} />
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="middleName">
            Middle Name
          </label>
          <input name="middleName" placeholder="Abiola" value={details?.middleName} onChange={handleChange}/>
        </div>
        <div className="custom-input-wrapper d-flex flex-column">
          <label htmlFor="dob">
            Date of Birth:
          </label>
           <DatePicker
                     selected={
                       details?.dateOfBirth &&
                       !isNaN(Date.parse(details?.dateOfBirth))
                         ? new Date(details?.dateOfBirth)
                         : null
                     }
                     onChange={(date) =>
                       handleChange({
                         target: { name: "dateOfBirth", value: date },
                       })
                     }
                     className="w-100"
                     dateFormat="dd-MM-yyyy"
                   />
        </div>
        <div className="custom-input-wrapper d-flex flex-column">
          <label htmlFor="dateJoined">Date Joined:</label>
          <DatePicker
                     selected={
                       details?.dateJoined &&
                       !isNaN(Date.parse(details?.dateJoined))
                         ? new Date(details?.dateJoined)
                         : null
                     }
                     onChange={(date) =>
                       handleChange({
                         target: { name: "dateJoined", value: date },
                       })
                     }
                     className="w-100"
                     dateFormat="dd-MM-yyyy"
                   />
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="gender">
            Gender
          </label>
          <select name="gender" value={details?.gender} onChange={handleChange}>
            <option value="">Select</option>
            {genders?.map((gender) => (
              <option value={gender.sexId} key={gender.sexId}>
                {gender.sexname}
              </option>
            ))}
          </select>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="nationality">Nationality</label>
          <select name="nationality" value={details?.nationality} onChange={handleChange}>
            <option value="">Select</option>
            {nationalities.map((nation) => (
              <option value={nation.country_id} key={nation.country_id}>
                {nation.countryname}
              </option>
            ))}
          </select>
        </div>
        <div className="custom-input-wrapper">
          <label htmlFor="stateOfOrigin">State of Origin:</label>
          <select name="stateOfOrigin" value={details?.stateOfOrigin} onChange={handleChange}>
            <option value="">Select</option>
            {states.map((state) => (
              <option value={state.stateCode} key={state.stateCode}>
                {state.stateName}
              </option>
            ))}
          </select>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="sector">Sector:</label>
          <select name="sector" value={details?.sector} onChange={handleChange}>
            <option value="">Select</option>
            {sectors?.map((sector) => (
              <option value={sector.sectorcode} key={sector.sectorcode}>
                {sector.sectorname}
              </option>
            ))}
          </select>
        </div>
        <div className="custom-input-wrapper">
          <label htmlFor="title">Title</label>
          <select name="title" value={details?.title} onChange={handleChange} >
            <option value="">Select</option>
            {
              titles?.map((title)=>(
                <option value={title.code} key={title.name}>{title.name}</option>
              ))
            }
            </select>
        </div>
        </div>

        <div className="admin-task-forms">
        <h6>Contact Details:</h6> <div></div>
        <div className="custom-input-wrapper">
          <label htmlFor="residentState">Resident State <sup className='text-danger'>*</sup> </label>
          <select name="residentState" value={details?.residentState} required onChange={handleChange}>
            <option value="">Select</option>
            {residentStates?.map((state) => (
              <option value={state.stateCode} key={state.stateCode}>
                {state.stateName}
              </option>
            ))}
          </select>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="town">Town</label>
          <select name="town" value={details?.town} onChange={handleChange}>
            <option value="">Select</option>
            {towns?.map((town) => (
              <option value={town.townCode} key={town.townCode}>
                {town.townName}
              </option>
            ))}
          </select>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="residentAddress">
            Resident Address
          </label>
          <textarea name="residentAddress" value={details?.residentAddress} onChange={handleChange}/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="officeAddress">Office Address</label>
          <textarea name="officeAddress" value={details?.officeAddress} onChange={handleChange}/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="mobilePhone1">
            Phone Number1<sup className="text-danger">*</sup>
          </label>
          <input name="mobilePhone1" value={details?.mobilePhone1} onChange={handleChange} required/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="mobilePhone2">Phone Number2:</label>
          <input name="mobilePhone2" onChange={handleChange} value={details?.mobilePhone2}/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="officePhone">Office Phone Number:</label>
          <input name="officePhone" placeholder="08131215178" value={details?.officePhone}/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="emailAddress">
            Email Address<sup className="text-danger">*</sup>
          </label>
          <input name="emailAddress" value={details?.emailAddress} onChange={handleChange} required />
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="identificationType">Identification Type</label>
          <select name="identificationType" value={details?.identificationType} onChange={handleChange}>
            <option value="">Select</option>
            {idTypes?.map((type) => (
              <option value={type.idCardId} key={type.idCardId}>
                {type.idCardName}
              </option>
            ))}
          </select>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="identificationNumber">Identification Number</label>
          <input name="identificationNumber" value={details?.identificationNumber} onChange={handleChange}/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="bvn">BVN</label>
          <input name="bvn" value={details?.bvn} onChange={handleChange}/>
        </div>
        </div>
        <div className="admin-task-forms">
        <h6>Next of Kin Details:</h6> <div></div>
        <div className="custom-input-wrapper ">
          <label htmlFor="nameOfNextOfKin">Next Of Kin Name:</label>
          <input name="nameOfNextOfKin" value={details?.nameOfNextOfKin} onChange={handleChange}/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="nextOfKinPhone">Next of kin phone:</label>
          <input name="nextOfKinPhone" value={details?.nextOfKinPhone} onChange={handleChange} />
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="nextOfKinAddress">Next of kin Address</label>
          <textarea name="nextOfKinAddress" value={details?.nextOfKinAddress} onChange={handleChange}/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="relationshipWithNextOfKin">Relationship with Next of kin</label>
          <input name="relationshipWithNextOfKin" value={details?.relationshipWithNextOfKin} onChange={handleChange}/>
        </div>
        </div>
        {/* <div className="statutory-list">
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="hasLoginDetail">Has Login Details?</label>{" "}
          <input name="hasLoginDetail" type="checkbox" checked={details.hasLoginDetail} onChange={handleChange}/>
        </div>
        </div> */}
        <div className="admin-task-forms">
        <h6>Account Section:</h6> <div></div>
        <div className="custom-input-wrapper ">
          <label htmlFor="accountBranch">
            Account Branch
          </label>
          <select name="accountBranch" value={details?.accountBranch} onChange={handleChange}>
            <option value="">Select</option>
            {branches?.map((branch) => (
              <option value={branch.branchCode} key={branch.branchCode}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="accountProduct">
            Account Product
          </label>
          <select name="accountProduct" value={details?.accountProduct} onChange={handleChange}>
            <option value="">Select</option>
            {products?.map((product) => (
              <option value={product.productCode} key={product.productCode}>
                {product.productName}
              </option>
            ))}
          </select>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="accountDescription">
            Account Description
          </label>
          <input name="accountDescription" value={details?.accountDescription} onChange={handleChange}/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="monthlyContribution">
            Contribution Amount
          </label>
          <NumericFormat thousandSeparator={true} fixedDecimalScale={true} decimalScale={2}
           name="monthlyContribution" value={details?.monthlyContribution} onChange={handleChange} />
        </div>
        </div>
        <div className="admin-task-forms">
        <h6>Reg. Fee Details:</h6> <div></div>
        <div className="custom-input-wrapper ">
          <label htmlFor="accountNumber">Account Number</label>
          <input name="accountNumber" value={details?.accountNumber} onChange={handleChange}/>
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="paymentBank">Payment Bank</label>
          <input name="paymentBank" value={details?.paymentBank} onChange={handleChange} />
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="amount">Amount:</label>
          <NumericFormat fixedDecimalScale={true} decimalScale={2} thousandSeparator={true}
           name="amount" value={details?.amount} onChange={handleChange} />
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="tellerNumber">Teller No:</label>
          <input name="tellerNumber" value={details?.tellerNumber} onChange={handleChange}/>
        </div>
        </div>
        <div className="admin-task-forms">
        <h6>Referral Details:</h6> <div></div>
        <div className="custom-input-wrapper">
          <label htmlFor="referralName">Referral Name</label>
          <input name="referralName" value={details?.referralName} onChange={handleChange} />
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="ReferralPhoneNumber">Referral Phone Number</label>
          <input name="referralPhoneNumber" value={details?.referralPhoneNumber} onChange={handleChange} />
        </div>
        <div className="custom-input-wrapper ">
          <label htmlFor="referralAddress">Referral Address</label>
          <input name="referralAddress" value={details?.referralAddress} onChange={handleChange} />
        </div>
      </div>
      </div>
      <div className="d-flex gap-3 justify-content-end mt-3 p-3" 
      style={{backgroundColor:'#f2f2f2', borderRadius:'0 0 15px 15px'}}>
        <button
          type="reset"
          className="btn btn-md px-4 rounded-5"
          style={{ backgroundColor: "#F7F7F7" }}
        >
          Discard
        </button>
        <button
          type="submit"
          className="border-0 btn-md member rounded-5 text-white"
        >
          Save
        </button>
      </div>
      <ToastContainer/>
      </form>
    </div>
  );
};

export default EditMember;
