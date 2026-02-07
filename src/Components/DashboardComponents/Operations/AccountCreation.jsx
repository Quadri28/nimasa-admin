import React, { useContext, useEffect, useState } from "react";
import Combobox from "react-widgets/Combobox";
import "react-widgets/styles.css";
import axios from "../../../Components/axios";
import { UserContext } from "../../AuthContext";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./AccountCreation.css";
import { ToastContainer, toast } from "react-toastify";
import ErrorText from "../ErrorText";
import { NumericFormat } from "react-number-format";

const AccountCreation = () => {
  const { credentials } = useContext(UserContext);
  const [members, setMembers] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subBranches, setSubBranches] = useState([]);
  const [memberId, setMemberId] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [selected, setSelected] = useState("");
  const [details, setDetails] = useState({})
  const [accountProduct, setAccountProduct] = useState('')
  const [customerDetails, setCustomerDetails]= useState({})

  const handleChange=(e)=>{
    const name =e.target.name;
    const value = e.target.value;
    setDetails({...details, [name]:value})
  }

  const getMembers = () => {
    axios("MemberManagement/get-member-detail-slim", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setMembers(resp.data.data));
  };

  const getCustomerDetails=()=>{
    axios(`MemberManagement/get-member-by-unique-Id?uniqueId=${uniqueId}`, {headers:{
      Authorization: `Bearer ${credentials.token}`
    }}).then(resp=>setCustomerDetails(resp.data.data))
  }
  useEffect(()=>{
    getCustomerDetails()
  }, [memberId])

  const getDetails= async()=>{
await axios (`MemberManagement/get-product-information?productCode=${accountProduct}`, {
  headers: {
    Authorization: `Bearer ${credentials.token}`
  }
}).then(resp=>setDetails(resp.data.data))
}
  useEffect(()=>{
    getDetails()
  }, [accountProduct])

  const getProducts = () => {
    axios("MemberManagement/get-products", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setProducts(resp.data.data));
  };
  const getBranches = () => {
    axios("MemberManagement/get-branch", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBranches(resp.data.data));
  };
  const getSubBranches = () => {
    axios(`MemberManagement/get-sub-branch?branchCode=${selected}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      }
    }).then((resp) => setSubBranches(resp.data.data));
  };

  useEffect(() => {
    getMembers();
    getBranches();
    getProducts();
  }, []);

  useEffect(() => {
    getSubBranches();
  }, [selected]);
  const initialValues = {
    subBranchCode: "",
    accountDescription: "",
    crInterestRate: '',
    drInterestRate: '',
    blockViewOnAccount: false,
    customerId: '',
  };

  const validationSchema = Yup.object({
    subBranchCode: Yup.string().label("subBranch Code"),
    accountDescription: Yup.string().label("Account Description"),
    blockViewOnAccount: Yup.boolean().label("Block view account"),
    customerId: Yup.string().label("Customer ID"),
    // oldAccountNumber: Yup.string().label("Branch Code"),
  });

  const onSubmit = (values) => {
    const payload = {
      branchCode: selected,
      subBranchCode: '0001',
      accountProduct: accountProduct,
      accountDescription: values.accountDescription,
      crInterestRate: Number(details.crRate),
      drInterestRate: Number(details.drRate),
      blockViewOnAccount: values.blockViewOnAccount,
      customerId: memberId,
      oldAccountNumber: values.oldAccountNumber,
    };
    axios
      .post("MemberManagement/create-account", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
      )
      .catch((error) =>
        toast(error.message, {
          type: "error",
          autoClose: false,
          pauseOnHover: true,
        })
      );
  };

  return (
    <div style={{ border: "solid 1px #f7f4fa", borderRadius: "10px", marginTop:'1.5rem' }}>
      <div
        style={{ backgroundColor: "#F5F9FF", borderRadius: "10px 10px 0 0" }}
        className="p-3"
      >
        <h5 style={{fontSize:'16px'}}>Account Creation</h5>
      </div>
      <div className="w-100 my-4 px-3">
        <div className="d-flex flex-column">
        <label htmlFor="">Search for a username</label>
        <Combobox
          data={members}
          textField="fullname"
          dataKey="customerId"
          placeholder="Search for a user name"
          hideCaret
          onChange={(value) => {
            setMemberId(value.customerId);
            setUniqueId(value.uniqueID)
          }}
          filter='contains'
        />
      </div>
      </div>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        <Form>
          <div className="admin-task-forms px-3 ">
            <div className="d-flex flex-column gap-1">
              <label htmlFor="">Customer ID:</label>
              <Field name="memberId" value={memberId} readOnly />
            </div>
            <div className="d-flex flex-column gap-1">
              <label htmlFor="">
                Select Branch<sup className="text-danger">*</sup>:
              </label>
              <select name={selected} as="select" required onChange={(e)=>setSelected(e.target.value)}>
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option value={branch.branchCode} key={branch.branchCode}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
              <ErrorMessage name="branchCode" component={ErrorText} />
            </div>
            <div className="d-flex flex-column gap-1 gap-1">
              <label htmlFor="">
                Select Account Product <sup className="text-danger">*</sup>:
              </label>
              <select name="accountProduct" as="select" required
              onChange={(e)=>setAccountProduct(e.target.value)}>
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option value={product.productCode} key={product.productCode}>
                    {product.productName}
                  </option>
                ))}
              </select>
             
            </div>
            <div className="d-flex flex-column gap-1 gap-1">
              <label htmlFor="">Select SubBranch:</label>
              <Field name="subBranch" as="select">
                <option value="">Select Account Branch</option>
                {subBranches.map((subBranch) => (
                  <option
                    value={subBranch.subBranchCode}
                    key={subBranch.subBranchCode}
                  >
                    {subBranch.subBranchName}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="subBranch" component={ErrorText} />
            </div>
            <div className="d-flex flex-column gap-1 gap-1">
              <label htmlFor="">Account Description:</label>
              <Field name="accountDescription" />
              <ErrorMessage name="accountDescription" component={ErrorText} />
            </div>
            <div className="d-flex flex-column gap-1 gap-1">
              <label htmlFor="crRate">CR Interest Rate:</label>
              <input name="crRate" value={details?.crRate} onChange={handleChange}/>
            </div>
            <div className="d-flex flex-column gap-1 gap-1">
              <label htmlFor="drRate">DR Interest Rate:</label>
              <input  name="drRate" onChange={handleChange} value={details?.drRate}  />
            </div>
            </div>
            <div className="statutory-list px-3 mt-2">
            <div className="d-flex align-items-center gap-3">
              <label htmlFor="blockViewOnAccount">Block View on Account?</label>
              <Field name="blockViewOnAccount" type="checkbox" />
              <ErrorMessage name="blockViewOnAccount" component={ErrorText} />
              </div>
              </div>
              <div className="admin-task-forms px-3">
              <div
                className="d-flex flex-column gap-3 p-0"
                style={{
                  boxShadow: "3px 3px 3px 3px #ddd",
                  borderRadius: "10px 10px 0 0",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#EDF4FF",
                    paddingTop: "10px",
                    paddingInline: "15px",
                    borderRadius: "10px 10px 0 0",
                  }}
                >
                  <p>Account Information</p>
                </div>
                <div className="px-3 py-2 d-flex flex-column  gap-3">
                  <div className="d-flex gap-3 discourse">
                    <span>Product Name</span>
                    <p>{details?.productName}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Product Start Date</span>
                    <p>{details?.productStart}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Product Expiry Date</span>
                    <p>{details?.productExpire}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Currency</span>
                    <p>{details?.currencyMne}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Open Balance</span>
                    <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.openBalance)}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Dr Interest</span>
                    <p>{details?.drRate}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Cr Interest</span>
                    <p>{details?.crRate}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Closing Charges</span>
                    <p>{details?.closeCharge}</p>
                  </div>
                </div>
              </div>
            <div
                className="d-flex flex-column gap-3 px-0"
                style={{ boxShadow: "3px 3px 3px 3px #ddd", borderRadius:'10px 10px 0 0' }}
              >
                <div style={{ backgroundColor: "#FEF3E6", paddingTop: "10px", paddingInline:'15px', borderRadius:'10px 10px 0 0' }}>
                  <p>Customer Information</p>
                </div>
                <div className="d-flex flex-column gap-3 px-3">
                <div className="d-flex gap-3 discourse">
                  <span>Account Name</span>
                  <p>{customerDetails?.firstName} {customerDetails?.lastName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Gender</span>
                  <p>{customerDetails?.gender === '1' ? 'Male' : customerDetails?.gender === '2' ? 'Female' : 'Corporate'}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Date Joined</span>
                  <p>{customerDetails?.dateJoined}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Phone Number</span>
                  <p>{customerDetails?.mobilePhone1}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Email Address</span>
                  <p>{customerDetails?.emailAddress}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Nationality</span>
                  <p>{customerDetails?.nationality}</p>
                </div>
                {/* <div className="d-flex gap-3 discourse">
                  <span>State of Origin</span>
                  <p>{customerDetails?.stateOfOrigin}</p>
                </div> */}
                <div className="d-flex gap-3 discourse">
                  <span>Monthly Contribution</span>
                  <p>{customerDetails?.monthlyContribution}</p>
                </div>
              </div>
            </div>
            </div>
          <div
            className="d-flex gap-3 justify-content-end p-3 mt-3"
            style={{ backgroundColor: "#f2f2f2", borderRadius: "0 0 10px 10px" }}
          >
            <button
              type="reset"
              className="btn btn-md rounded-5"
              style={{ backgroundColor: "#FAFAFA", fontSize:'14px' }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-md rounded-5 text-white"
              style={{ backgroundColor: "var(--custom-color)", fontSize:'14px' }}
            >
              Submit
            </button>
          </div>
        </Form>
      </Formik>
      <ToastContainer/>
    </div>
  );
};

export default AccountCreation;
