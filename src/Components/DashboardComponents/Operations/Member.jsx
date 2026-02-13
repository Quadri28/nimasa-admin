import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { UserContext } from "../../../Components/AuthContext";
import { FaRegEdit } from "react-icons/fa";
import { GrEdit } from "react-icons/gr";
import axios from "../../axios";
import {Link, useNavigate } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";
import Table from "../CommunicationSubComponents/Table";
import { ErrorMessage, Field, Formik, Form} from "formik";
import ErrorText from "../ErrorText";
import * as Yup from 'yup'
import {FcSignature} from 'react-icons/fc'

const MemberIndex = () => {
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [memberDetail, setMemberDetail] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0); // ✅ Start from 0 (zero-based)
  const [pageSize, setPageSize] = useState(10); // ✅ Default page size
  const [searchQuery, setSearchQuery]= useState('')
  const { credentials } = useContext(UserContext);

// Modal functionality for contribution editing
  function handleCloseModal(){
    setIsOpen(false)
  }
  function handleOpenModal(){
    setIsOpen(true)
  }

  // Modal functionality for sending access
  function handleClose(){
    setModalOpen(false)
  }
  function handleOpen(){
    setModalOpen(true)
  }
  //Fetching Member Details
  const fetchMemberDetails=async()=>{
    axios(`MemberManagement/get-member-contribution-detail?UniqueId=${id}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setMemberDetail(resp.data.data))
  }
useEffect(()=>{
fetchMemberDetails()
}, [id])
const navigate = useNavigate()

const handleChange=(e)=>{
  const name =e.target.name;
  const value = e.target.value;
  setMemberDetail({...memberDetail, [name]:value})
}

const resendAccess=(id)=>{
  axios(`Account/resend-email-user-creation-access?uniqueId=${id}`,{headers:{
    Authorization: `Bearer ${credentials.token}`
  }}).then(resp=>{
    setTimeout(() => {
      fetchData({pageNumber:0, pageSize:10, search: searchQuery})
    }, 5000);
    toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
  }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
}

  const fetchData = useCallback(async ({ pageSize, pageNumber, search }) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `MemberManagement/get-member-details?PageNumber=${pageNumber + 1}&PageSize=${pageSize}&Filter=${encodeURIComponent(search)}`, // ✅ Convert to 1-based index for API
        {
          headers: {
            Authorization: `Bearer ${credentials.token}`,
          },
        }
      );
      if (response.data.data.modelResult) {
        setData(response.data.data.modelResult);
        setPageCount(Math.ceil(response.data.data.totalCount / pageSize));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [credentials.token]);

  // ✅ Trigger data fetch when pageNumber or pageSize changes
 useEffect(() => {
  const delayDebounce = setTimeout(() => {
    fetchData({ pageSize, pageNumber, search: searchQuery });
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchQuery, pageNumber, pageSize, fetchData]);

  const columns = useMemo(
    () => [
      { Header: "Customer ID", accessor: "customerId" },
      { Header: "Full Name", accessor: "fullname" },
      { Header: "Phone Number", accessor: "phone1" },
      { Header: "Customer Type", accessor: "customerType" },
      {
        Header: "Date Joined",
        accessor: "createDate",
        Cell: ({ cell: { value } }) => (
          <div>
            {new Date(value).toLocaleDateString()} {new Date(value).toLocaleTimeString()}
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) =>
          value !== "ACTIVE" ? (
            <div className="suspended-status px-2" >
              <hr /> <span>Inactive</span>
            </div>
          ) : (
            <div className="active-status px-2" style={{ width: "max-content" }}>
              <hr />
              <span> Active</span>
            </div>
          ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (props) => {
          const id = props.row.original.uniqueID;
          const type = props.row.original.customerType;
          const access = props.row.original.portalAccess
          return (
            <div className="d-flex justify-content-around gap-2 align-items-center px-3">
              <div className="status-icon position-relative">
                <span className="stat">Edit member</span>
                <Link className="fs-6 text-dark" to={type === "INDIVIDUAL" ? `edit-member/${id}` : `edit-corporate-member/${id}`}>
                  <GrEdit />
                </Link>
              </div>
              {access=== 'None' && access != 'Newly_Created'  && access != 'Active'
               && access != 'Disabled' || access === null?<div className="status-icon position-relative">
                <span className="stat">Create access</span>
                <BsSend style={{ cursor: "pointer" }} onClick={() => {
                  setId(id);
                  handleOpen();
                }} />
              </div>: null}
              {access != 'None' && access === 'Newly_Created'  && access !='Active' && access !='Disabled'? 
              <div className="status-icon position-relative">
                <span className="stat">Resend access</span>
                <FaArrowRotateLeft style={{ cursor: "pointer" }} onClick={() => resendAccess(id)} />
              </div>: null}
             <div className="status-icon position-relative">
                <span className="stat">Edit contribution</span>
                <FaRegEdit style={{ cursor: "pointer" }} onClick={() => {
                  setId(id);
                  handleOpenModal();
                }} />
              </div>
               {type !== 'INDIVIDUAL' &&<div className="status-icon position-relative">
                <span className="stat">Signatory</span>
                <FcSignature style={{ cursor: "pointer" }} onClick={() => {
                  setId(id);
                  navigate(`signatory/${id}`)
                }} />
              </div>}
            </div>
          );
        },
      },
    ],
    []
  );

  const initialValues={
    password:'',
    confirmPassword:''
  }
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .matches(
        passwordRegex,
        "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*)."
      )
      .label("Password"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const onSubmit=(values)=>{
    const payload={
      userName: memberDetail?.userId,
      password: values.password,
    }
    axios.post(`MemberManagement/create-portal-access?uniqueId=${id}`, payload, {
      headers:{
        Authorization: `Bearer ${credentials.token}`
      }
    }).then(resp=>{
      setTimeout(() => {
        handleClose()
        fetchData({pageNumber:0, pageSize:10, search: searchQuery})
      }, 5000);
      toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
    }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }
 
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      height: "60%",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      // padding:'1rem',
      borderRadius: "1rem",
      width: "330px",
      overFlowY: "scroll",
    },
  };

  const handleSubmit=(e)=>{
    e.preventDefault()
    const payload={
      uniqueId: id,
      contributionAmount: Number(memberDetail.monthlyContri)
    }
    axios.post('MemberManagement/change-contribution', payload, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>{
      toast(resp.data.message, {type:'success', autoClose:5000, pauseOnHover:true})
      setTimeout(() => {
        handleCloseModal()
      }, 5000);
    }).catch(error=>toast(error.response.data.message, {type:'error', autoClose:false}))
  }

  return (
    <>
    <div className="d-flex gap-3 align-items-center justify-content-end">
            <Link to='bulk-login-access'>
              <button className="bnt-md border-0 py-2 px-3 rounded-5" style={{backgroundColor:'#E6F0FF', color:'var(--custom-blue)'}}>Bulk login access</button>
            </Link>
            <Link to='add-members'>
              <button className="member bnt-md border-0">Add new member</button>
            </Link>
            </div>
      <Table
        fetchData={fetchData}
        pageCount={pageCount}
        data={data}
        loading={loading}
        columns={columns}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        pageSize={pageSize} 
        setPageSize={setPageSize}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
{/* Modal to edit contribution */}
      <Modal 
       isOpen={isOpen}
       onRequestClose={handleCloseModal}
       style={customStyles}>
        <form onSubmit={handleSubmit}>
          <h2 className="text-center" style={{fontSize:'16px', fontWeight:'600', color:'#1d1d1d'}}>Edit Contribution</h2>
        <div className="d-flex flex-column gap-2 item-register-container">
          <div className="d-flex flex-column gap-1">
            <label htmlFor="firstName">First Name</label>
            <input type="text"  name="firstName" value={memberDetail?.firstName} disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="surname">Last Name</label>
            <input type="text"  name="surname" value={memberDetail?.surname} disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="otherName">Other Name</label>
            <input type="text"  name="otherName" value={memberDetail?.otherName} disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="accountNumber">Contribution Account No</label>
            <input type="text"  name="accountNumber" value={memberDetail?.accountNumber} disabled/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="monthlyContri">Contribution Amount</label>
            <input type="text"  name="monthlyContri" onChange={handleChange}
             value={memberDetail?.monthlyContri}/>
          </div>
          </div>  
          <div className="d-flex justify-content-end mt-3">
            <button className="member border-0 btn-md">Update</button>
            </div>  
        </form>
        </Modal>

        {/* Modal to create portal access */}
        <Modal 
       isOpen={modalOpen}
       onRequestClose={handleClose}
       style={customStyles}
       ariaHideApp={false}>
        <Formik onSubmit={onSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}>
          <Form>
          <h2 className="text-center mb-2" style={{fontSize:'18px', fontWeight:'600', color:'#1d1d1d'}}>Create Access</h2>
        <div className="d-flex flex-column gap-2 item-register-container">
          <div className="d-flex flex-column gap-1">
            <label htmlFor="userId">User Name</label>
            <input type="text"  name="userId" onChange={handleChange} value={memberDetail?.userId}/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="password">Password</label>
            <Field type="password"  name="password"/>
            <ErrorMessage name="password" component={ErrorText}/>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field type="password"  name="confirmPassword"/>
            <ErrorMessage name="confirmPassword" component={ErrorText}/>
          </div>
          </div>
          <button className="member w-100 border-0 btn-md mt-4">Create access</button>
          </Form>
          </Formik>
          </Modal>
      <ToastContainer />
    </>
  );
};

export default MemberIndex;
