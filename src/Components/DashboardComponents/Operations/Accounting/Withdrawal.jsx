import React, { useContext, useEffect, useMemo, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../../axios";
import ErrorText from "../../ErrorText";
import { UserContext } from "../../../AuthContext";
import "./Accounting.css";
import { ToastContainer, toast } from "react-toastify";
import { Combobox } from "react-widgets/cjs";

const Withdrawal = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [receivingAccount, setReceivingAccount] = useState("");
  const [sourceAccount, setSourceAccount] = useState("");
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false)
  const { credentials } = useContext(UserContext);

  const getVoucherNo = () => {
    axios("MemberManagement/get-batch-no", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBatchNo(resp.data.message));
  };

  const fetchDetails = () => {
    axios(
      `Acounting/withdrawal-account-number-text-Change?AccountNumber=${receivingAccount}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setDetails(resp.data.data));
  };
  const fetchCurrencies = () => {
    axios("Common/get-currencies", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setCurrencies(resp.data));
  };

  useEffect(() => {
    getVoucherNo();
    fetchCurrencies();
  }, []);
  useEffect(() => {
    fetchDetails();
  }, [receivingAccount]);

  const fetchCustomerEnquiries = () => {
    axios("Acounting/member-account-enquiry", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setEnquiries(resp.data.data));
  };
  const fetchLedgerAccounts = () => {
    axios("Acounting/general-ledger-customer-enquiry?SearchOption=1", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setLedgers(resp.data.data));
  };
  useEffect(() => {
    fetchCustomerEnquiries();
    fetchLedgerAccounts();
  }, []);

  const initialValues = {
    sourceAccount: "",
    valueDate: "",
    payAmount: 0,
    voucherNumber: 0,
    // paymentDescription: "",
    currencyCode: "",
    overide: "",
    valid: "",
    overideId: "",
    rate: 0,
    branchCode: "",
  };
  const validationSchema = Yup.object({
    rate: Yup.string().required().label("Rate"),
  });


  const onSubmit = (values, {resetForm}) => {
    setLoading(true)
    const payload = {
      valueDate: values.valueDate,
      payAmount: Number(amount),
      accountNumber: receivingAccount,
      sourceAccount: sourceAccount,
      voucherNumber: batchNo,
      paymentDescription: details.narration ,
      currencyCode: values.currencyCode,
      overide: values.overide,
      valid: values.valid,
      overideId: values.overideId,
      rate: values.rate,
      branchCode: details.branchCode,
    };
    axios
      .post("Acounting/withdrawal", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>{
        setLoading(false)
        toast(resp.data.message, {
          type: "success",
          pauseOnHover: true,
          autoClose: 5000,
        })
        setAmount(0)
        setSourceAccount('')
        setReceivingAccount('')
        resetForm()
      })
      .catch((error) =>{
        setLoading(false)
        toast(error.response.data.message, {
          type: "error",
          autoClose: false,
          pauseOnHover: true,
        })
      });
  };

   const formattedEnquiries = ledgers.map((e) => ({
  ...e,
  label: `${e.acctName} >> ${e.product}`,
}));

const formattedCreditEnquiries= enquiries.map((e) => ({
  ...e,
  label: `${e.acctName} >> ${e.product}`,
}));

  return (
    <div className="mt-4">
       <div
            className="bg-white"
            style={{
              borderRadius: "15px",
              border: "solid .5px #fafafa",
              borderBlock: "0",
            }}
      >
      <div
        style={{
          backgroundColor: "#f4fAfd",
          borderRadius: "15px 15px 0 0",
        }}
        className="p-3"
      >
        <h5 style={{fontSize:'16px', color:'#333'}}>Withdrawal</h5>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
            <div className="my-3 admin-task-forms px-3">
              <div className="d-flex flex-column gap-1 ">
                <label htmlFor="sourceAccount">Source account number:</label>
                  <Combobox
                  data={formattedEnquiries}
                  value={sourceAccount}
                  onChange={(val) => setSourceAccount(val.accountNumber)}
                  valueField="accountNumber"
                  textField="label"
                  filter="contains"
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="accountNumber">Account number:</label>
                 <Combobox
                  data={enquiries}
                  value={receivingAccount}
                  onChange={(val) => setReceivingAccount(val.accountNumber)}
                  valueField="accountNumber"
                  textField="accountTitle"
                  filter="contains"
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="voucherNumber">Voucher number:</label>
                <input name="voucherNumber" value={batchNo} readOnly />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="valueDate">Select value date:</label>
                <Field name="valueDate" type='date'  />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="narration">Enter narration:</label>
                <input name="narration" value={details?.narration} readOnly />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="amount">Enter amount:</label>
                <input
                  name={amount}
                  value={amount}
                  type="number"
                  required
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="d-flex flex-column gap-1 gap-1">
                    <label htmlFor="currencyCode">Currency</label>
                    <Field name="currencyCode" as="select"
                  className="w-100"
                  >
                      <option value="">Select currency</option>
                      {currencies.map((currency) => (
                        <option
                          value={currency.countryCode}
                          key={currency.countryCode}
                        >
                          {currency.currencyName}
                        </option>
                      ))}
                    </Field>
                  </div>
                  <div className="d-flex flex-column gap-1 gap-1">
                    <label htmlFor="rate">Rate</label>
                    <Field name="rate" />
                    <ErrorMessage name="rate" component={ErrorText} />
                  </div>
                  <div className="d-flex flex-column gap-1 gap-1">
                    <label htmlFor="tranAmount">Tran. Amount</label>
                    <input value={amount} name="tranAmount" readOnly />
                </div>
            
            </div>
            <hr className="mx-4"/>
            <div className="my-5 px-4">
              <div
                className="d-flex flex-column gap-1 gap-2 p-0"
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
                  <p>Debit Account Info</p>
                </div>
                <div className="px-3 py-2 d-flex flex-column gap-1 gap-2">
                  <div className="d-flex gap-3 discourse">
                    <span>Account Name:</span>
                    <p>{details?.accountTitle}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Product Name:</span>
                    <p>{details?.prodName}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Branch:</span>
                    <p>{details?.branch}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Book Balance:</span>
                    <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.bkbal)}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Effective Balance:</span>
                    <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.effbal)}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Usable Balance:</span>
                    <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(details?.usebal)}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Source Type:</span>
                    <p>{details?.acctty}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Source:</span>
                    <p>{details?.source}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Account Status:</span>
                    <p>{details?.acctStatus}</p>
                  </div>
                  <div className="d-flex gap-3 discourse">
                    <span>Total Charge:</span>
                    <p>{details?.totalCharge}</p>
                  </div>
                </div>
              </div>
            </div>
          <div
              style={{
                backgroundColor: "#f2f2f2",
                borderRadius: "0 0 15px 15px",
              }}
              className="d-flex justify-content-end gap-3 p-3"
            >
              <button
                type="reset"
                className="border-0 btn-md rounded-5 px-3 py-1"
                style={{ backgroundColor: "#f7f7f7" }}
              >
                Discard
              </button>
              <button type="submit" className="border-0 btn-md member" disabled={loading}>
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
        </Form>
      </Formik>
      <ToastContainer />
    </div>
    </div>
  );
};

export default Withdrawal;
