import React, { useContext, useEffect, useState } from "react";
import { Form, Formik, ErrorMessage, Field } from "formik";
import ErrorText from "../ErrorText";
import "./SharesManagement.css";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { Combobox } from "react-widgets";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";

const AddSingleShare = () => {
  const [shareTypes, setShareTypes] = useState([]);
  const { credentials } = useContext(UserContext);
  const [members, setMembers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState("");
  const [gls, setGLs] = useState([]);
  const [input, setInput] = useState({
    accountType: 0,
  });
  const [value, setValue] = useState("");
  const [type, setType] = useState("");
  const [shareType, setShareType] = useState({});
  const getMembers = () => {
    axios("MemberManagement/get-member-detail-slim", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setMembers(resp.data.data));
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  const fetchMemberAccounts = async () => {
    await axios(
      `ShareManagement/get-member-savings-account-numbers?customerId=${value}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setAccounts(resp.data.data));
  };

  useEffect(() => {
    fetchMemberAccounts();
  }, [value]);

  const getSharesTypes = () => {
    axios("ShareManagement/share-types-slim", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setShareTypes(resp.data.data));
  };
  useEffect(() => {
    getSharesTypes();
    getMembers();
  }, []);

  const fetchShareType = async () => {
    await axios(`ShareManagement/share-type?id=${type}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setShareType(resp.data.data));
  };

  useEffect(() => {
    fetchShareType();
  }, [type]);
  const initialValues = {
    shareType: "",
    purchasingAmount: "",
    date: "",
    description: "",
  };
  const validationSchema = Yup.object({
    purchasingAmount: Yup.string().required(),
    date: Yup.string().required(),
    description: Yup.string().required(),
  });

  const onSubmit = (values) => {
    const payload = {
      memberId: value,
      debitAccountNumber: Number(input.accountType) == 1 ? input.account : account,
      purchasingDate: values.date,
      purchaseUnit: Number(values.purchasingAmount),
      description: values.description,
      shareTypeId: type,
      shareDebitAccountType: Number(input.accountType),
    };
    axios
      .post("ShareManagement/create-share", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) => {
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        });
        setTimeout(() => {
          navigate(-1);
        }, 5000);
      })
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false })
      );
  };

  const fetchGLAccounts = () => {
    axios(`Acounting/general-ledger-customer-enquiry?SearchOption=${1}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setGLs(resp.data.data));
  };
  useEffect(() => {
    fetchGLAccounts();
  }, []);

  const navigate = useNavigate();

  const formattedEnquiries = gls.map((e) => ({
    ...e,
    label: `${e.acctName} >> ${e.accountNumber}`,
  }));

  return (
    <Formik
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      initialValues={initialValues}
    >
      <Form>
        <div className="px-3 admin-task-forms bg-white pb-3">
          <div className="d-flex flex-column gap-2 ">
            <label htmlFor="member">Select Account Type</label>
            <select name="accountType" onChange={handleChange}>
              <option value="">Select settlement account type</option>
              <option value={1}>Member Saving</option>
              <option value={2}>GL Account</option>
            </select>
          </div>

          <div className="d-flex flex-column gap-2">
            <label htmlFor="member">Select Member</label>
            <Combobox
              data={members}
              textField="fullname"
              dataKey="customerId"
              onChange={(newValue) => setValue(newValue.customerId)}
              placeholder="Select a member"
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="shareType" style={{ fontWeight: "500" }}>
              Select Share Type
            </label>
            <select
              name="type"
              placeholder="Enter shares code"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select</option>
              {shareTypes.map((type) => (
                <option value={type.id} key={type.id}>
                  {type.shareProductName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="purchasingAmount" style={{ fontWeight: "500" }}>
              Purchasing Unit
            </label>
            <Field
              name="purchasingAmount"
              id="purchasingAmount"
              placeholder="Enter purchasing amount"
            />
          </div>
          <div className="d-flex flex-column gap-1">
            <label htmlFor="purchasingAmount" style={{ fontWeight: "500" }}>
              Share Price (Per unit)
            </label>
            <NumericFormat
              name="sharePerUnit"
              disabled
              thousandSeparator={true}
              decimalScale={2}
              fixedDecimalScale={true}
              placeholder="share per unit"
              value={shareType.sharePrice}
            />
          </div>
          <div className="d-flex flex-column g-2 ">
            <label htmlFor="account" style={{ fontWeight: "500" }}>
              Select Settlement Account<sup className="text-danger">*</sup>
            </label>
            {input.accountType == 1 ? ( <select name="account" onChange={handleChange}>
             
                <>
                  <option value="">Select</option>
                  {accounts.map((account, i) => (
                    <option value={account.accountNumber} key={i}>
                      {account.accountProduct}
                    </option>
                  ))}
                </>
            </select>
              )
             : (
                <>
                   <Combobox
                      data={formattedEnquiries}
                      value={account}
                      onChange={(val) => setAccount(val.accountNumber)}
                      valueField="accountNumber"
                      textField="label"
                      filter="contains"
                    />
                </>)}
          </div>
          <div className="d-flex flex-column gap-1 ">
            <label htmlFor="date" style={{ fontWeight: "500" }}>
              Select Date
            </label>
            <Field name="date" id="date" type="date" />
          </div>
          <div className="d-flex gap-1 flex-column">
            <label htmlFor="description" style={{ fontWeight: "500" }}>
              Description/Narration
            </label>
            <Field
              name="description"
              id="description"
              placeholder="Enter description"
              as="textarea"
            />
          </div>
        </div>
        <div
          className="d-flex justify-content-end gap-3 py-4 px-2 mt-3"
          style={{ backgroundColor: "#FAFAFA", borderRadius: "0 0 10px 10px" }}
        >
          <button
            className="btn btn-md rounded-5 py-1 px-3"
            style={{ backgroundColor: "#F7F7F7", fontSize: "14px" }}
            type="reset"
          >
            Discard
          </button>
          <button
            className="btn btn-md text-white rounded-5"
            style={{ backgroundColor: "var(--custom-color)", fontSize: "14px" }}
            type="submit"
          >
            Add Share
          </button>
          <ToastContainer />
        </div>
      </Form>
    </Formik>
  );
};

export default AddSingleShare;
