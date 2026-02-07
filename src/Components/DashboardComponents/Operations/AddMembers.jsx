import React, { useContext, useState } from "react";
import AddMultipleMember from "./AddMultipleMember";
import AddSingleMember from "./AddSingleMember";
import * as Yup from "yup";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const AddMembers = () => {
  const {credentials} = useContext(UserContext)

  const [chosen, setChosen] = useState("single");
  const [file, setFile] = useState(null);
  const [batchNo, setBatchNo]= useState('')
  const [isLogin, setIsLogin]= useState(false)
  const [data, setData]= useState([])
  const [memberType, setMemberType]= useState('individual')
  const [input, setInput] = useState({})

  const changeHandler=(e)=>{
    const name= e.target.name;
    const value= e.target.value;
    setInput({...input, [name]:value})
  }
  const navigate =useNavigate()
  const initialValues = {
    memberId: "",
    customId: false,
    firstName:'',
    lastName:'',
    middleName:'',
    dob:'',
    gender:'',
    dateJoined:'',
    nationality:'',
    stateOfOrigin:'',
    sector:'',
    memberImage:'',
    title:'',
    residentState:'',
    residentTown:'',
    residentAddress:'',
    officeAddress:'',
    phone1:'',
    phone2:'',
    officePhone:'',
    email:'',
    idType:'',
    idNumber:'',
    uploadId:'',
    bvn: "",
    nofName:'',
    nofPhone:'',
    nofAddress:'',
    nofRelationship:'',
    userName:'',
    password:'',
    confirmPassword:'',
    acctBranch:'',
    acctProduct:'',
    acctDesc:'',
    acctNo:'',
    paymentBank:'',
    amount: 0,
    tellerNo:'',
    refName:'',
    refPhone:'',
    refAddress:'',
  };

  const validationSchema = Yup.object({
    memberId: Yup.string().required("Required"),
    customId: Yup.boolean(),
    firstName: Yup.string()
    .min(3, "must be more than 3 characters")
    .required("Required"),
lastName: Yup.string()
    .min(3, "must be more than 3 characters")
    .required("Required"),
middleName: Yup.string().min(3, "must be more than 3 characters"),
    dob: Yup.string().required("Required"),
    gender: Yup.string().required("Required"),
    dateJoined: Yup.string(),
    nationality: Yup.string(),
    stateOfOrigin:Yup.string(),
    sector: Yup.string(),
    memberImage: Yup.string(),
    title: Yup.string(),
    residentState:Yup.string(),
    residentTown: Yup.string(),
    residentAddress: Yup.string().required("Required"),
    officeAddress: Yup.string().min(10, "minimum of 10 characters"),
    phone1: Yup.string().min(11).required("Required").max(11).label('Phone No'),
    phone2: Yup.string().min(11).max(11),
    officePhone: Yup.string().max(11).min(11),
    email: Yup.string().email().required("Required"),
    idType:  Yup.string(),
    idNumber:  Yup.string(),
    uploadId: Yup.string(),
    bvn: Yup.string()
      .min(11, "B.V.N must be 11 characters")
      .max(11, "B.V.N must be 11 characters"),
    nofName: Yup.string().min(4),
    nofPhone: Yup.string().min(11).max(11),
    nofAddress: Yup.string().min(10),
    nofRelationship:Yup.string(),
    userName: Yup.string(),
    password: Yup.string(),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match'),
    acctBranch: Yup.string().required('Required'),
    acctProduct: Yup.string().required('Required'),
    acctDesc: Yup.string().required('Required'),
    acctNo: Yup.string(),
    paymentBank: Yup.string(),
    amount: Yup.string(),
    tellerNo: Yup.string(),
    refName: Yup.string(),
    refPhone: Yup.string().max(11).min(11),
    refAddress: Yup.string().min(10, 'must be at least 10 characters'),
  });

  const onSubmit = (values, {resetForm}) => {
    const payload = new FormData()
    payload.append('MemberType', memberType),
    payload.append('UseCustomMemberId', values.customId ? true : false),
    payload.append('MemberId', String(values.memberId)),
    payload.append('FirstName', values.firstName),
    payload.append('LastName', values.lastName),
    payload.append('MiddleName', values.middleName),
    payload.append('Gender', String(values.gender)),
    payload.append('DateJoined', String(values.dateJoined)),
    payload.append('DateOfBirth', String(values.dob)),
    payload.append('Nationality', String(values.nationality)),
    payload.append('StateOfOrigin', String(values.stateOfOrigin)),
    payload.append('Sector', String(values.sector)),
    payload.append('MemberImage', values.memberImage),
    payload.append('Title', values.title),
    payload.append('ResidentState', String(values.residentState)),
    payload.append('Town', String(values.residentTown)),
    payload.append('ResidentAddress', String(values.residentAddress)),
    payload.append('OfficeAddress', String(values.officeAddress)),
      payload.append('MobilePhone1', String(values.phone1)),
      payload.append('MobilePhone2', String(values.phone2)),
      payload.append('OfficePhone', String(values.officePhone)),
      payload.append('EmailAddress', String(values.email)),
      payload.append('IdentificationType', String(values.idType)),
      payload.append('IdentificationNumber', String(values.idNumber)),
      payload.append('IdentificationCardUpload', values.uploadId),
      payload.append('BVN', String(values.bvn)),
      payload.append('NameOfNextOfKin', String(values.nofName)),
      payload.append('NextOfKinPhone', String(values.nofPhone)),
      payload.append('NextOfKinAddress', String(values.nofAddress)),
      payload.append('RelationshipWithNextOfKin', String(values.nofRelationship)),
      payload.append('HasLoginDetail', isLogin ? true : false),
      payload.append('UserName', String(values.userName)),
      payload.append('Password', String(values.password)),
      payload.append('ConfirmPassword', String(values.confirmPassword)),
      payload.append('AccountBranch', String(values.acctBranch)),
      payload.append('AccountProduct', String(values.acctProduct)),
      payload.append('AccountDescription', String(values.acctDesc)),
      payload.append('MonthlyContribution', Number(input.contributionAmount.replace(/,/g, ""))),
      payload.append('AccountNumber', String(values.acctNo)),
      payload.append('PaymentBank', String(values.paymentBank)),
      payload.append('Amount', input.amount ? Number(input.amount.replace(/,/g, "")) : 0),
      payload.append('TellerNumber', String(values.tellerNo)),
      payload.append('ReferralName',String( values.refName)),
      payload.append('ReferralPhoneNumber', String(values.refPhone)),
      payload.append('ReferralAddress', String(values.refAddress))
    axios.post('MemberManagement/add-member-registration', payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(()=>{
      resetForm()
      toast('Member created successfully', {autoClose:5000, pauseOnHover:true, type:'success'})
      setTimeout(() => {
        navigate(-1)
      }, 5000);
  })
    .catch((error)=>{
    console.log(error)
    toast(error.message, {autoClose:5000, pauseOnHover:true, type:'error'})
  });
  };

// Upload bulk members
   const handleChange = (file) => {
       setFile(file);
       const payload = new FormData();
    payload.append('file', file)
    axios.post(`MemberManagement/upload-bulk-member?batchNo=${batchNo}`, payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=> {
      toast(resp.data.message, {type:'success', pauseOnHover:true, autoClose:5000})
      if (resp.data.data) {
        setData(resp.data.data)
      }
    })
    .catch(error=>toast(error.message, {type:'error', pauseOnHover:true, autoClose:5000}))
  }

  const getForm = () => {
    if (chosen === "single") {
      return <AddSingleMember 
      validationSchema={validationSchema}
       initialValues={initialValues}
       onSubmit={onSubmit} 
       isLogin={isLogin}
       setIsLogin={setIsLogin}
       memberType={memberType}
       setMemberType={setMemberType}
       changeHandler={changeHandler}
       />;
    } else if (chosen === 'multiple') {
      return <AddMultipleMember file={file} setFile={setFile} 
       batchNo={batchNo}
      setBatchNo={setBatchNo}
      handleChange={handleChange}
      data={data}
      />;
    }
  };

  return (
    <>
      <div className="d-flex gap-2 p-3 align-items-center flex-wrap" 
      style={{backgroundColor:'#E6F0FF', borderRadius:'15px 15px 0 0'}}>
        <BsArrowLeft onClick={()=>navigate(-1)} style={{cursor:'pointer'}}/>
        <span
          className={chosen === "single" ? `active-selector ${'header-links'}` : "header-links"}
          onClick={() => {
            setChosen("single");
          }}
        >
          Add Single Member
        </span>
        <span
          className={chosen === "multiple" ? `active-selector ${'header-links'}` : "header-links"}
          onClick={() => {
            setChosen("multiple");
          }}
        >
          Add Multiple Member
        </span>
      </div>
     
      {
        getForm()
      }
      <ToastContainer/>
    </>
  );
};

export default AddMembers;
