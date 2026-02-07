import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../../../Components/axios";
import ErrorText from "../../ErrorText";
import { UserContext } from "../../../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { Combobox } from "react-widgets/cjs";

const Transfer = () => {
  const [options, setOptions] = useState([]);
  const [debitOption, setDebitOption] = useState("");
  const [creditOption, setCreditOption] = useState("");
  const [creditAccount, setCreditAccount] = useState("");
  const [debitAccount, setDebitAccount] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [debitEnquiries, setDebitEnquiries] = useState([]);
  const [creditEnquiries, setCreditEnquiries] = useState([]);
  const [debitDetails, setDebitDetails] = useState({});
  const [creditDetails, setCreditDetails] = useState({});
  const { credentials } = useContext(UserContext);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("");

  const getVoucherNo = () => {
    axios("MemberManagement/get-batch-no", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setBatchNo(resp.data.message));
  };

  const getCurrencies = () => {
    axios("Common/get-currencies").then((resp) => setCurrencies(resp.data));
  };
  const fetchOptions = () => {
    axios("Acounting/general-Ledger-search-option", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setOptions(resp.data));
  };

  const fetchDebitAccountDetails = () => {
    axios(
      `Acounting/account-number-text-changed?DebitAccountNumber=${debitAccount}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setDebitDetails(resp.data.data.accountDetails));
  };

  const fetchCreditAccountDetails = () => {
    axios(
      `Acounting/account-number-text-changed?DebitAccountNumber=${creditAccount}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => {
      setCreditDetails(resp.data.data.accountDetails);
    });
  };
  const fetchDebitCustomerEnquiries = () => {
    axios(
      `Acounting/general-ledger-customer-enquiry?SearchOption=${debitOption}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setDebitEnquiries(resp.data.data));
  };
  const fetchCreditCustomerEnquiries = () => {
    axios(
      `Acounting/general-ledger-customer-enquiry?SearchOption=${creditOption}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setCreditEnquiries(resp.data.data));
  };

  useEffect(() => {
    fetchOptions();
    getVoucherNo();
    getCurrencies();
  }, []);

  useEffect(() => {
    fetchDebitCustomerEnquiries();
  }, [debitOption]);

  useEffect(() => {
    fetchDebitAccountDetails();
  }, [debitAccount]);
  useEffect(() => {
    fetchCreditAccountDetails();
  }, [creditAccount]);
  useEffect(() => {
    fetchCreditCustomerEnquiries();
  }, [creditOption]);

  const initialValues = {
    paymentDescription: "",
    currency: "",
    rate: 0,
    valueDate:''
  };
  const validationSchema = Yup.object({
    paymentDescription: Yup.string(),
    currency: Yup.string().required("Currency type is required"),
  });

  const validateDebitAccount = () => {
    axios(
      `Acounting/transfer-account-number-text-Change?AccountNumber=${debitAccount}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).catch((error) =>
      toast(error.response.data.message, {
        type: "error",
        pauseOnHover: true,
        autoClose: false,
      })
    );
  };

  useEffect(() => {
    validateDebitAccount();
  }, [debitAccount]);

  const onSubmit = (values, {resetForm}) => {
    setLoading(true)
    const payload = {
      debitAccountNumber: debitAccount,
      creditAccountNumber: creditAccount,
      valueDate: values.valueDate,
      payAmount: Number(paymentAmount),
      voucherNumber: Number(batchNo),
      paymentEvidence: null,
      paymentDescription: values.paymentDescription,
      currencyCode: values.currency,
      isReversa: false,
      rate: 1,
    };
    axios
      .post("Acounting/transfer", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>{
        setLoading(false)
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        })
        resetForm()
        setCreditAccount('')
        setDebitAccount('')
        setCreditOption('')
        setDebitOption('')
        setPaymentAmount('')
      }
      )
      .catch((error) => {
        setLoading(false)
        toast(error.response.data.message, {
          type: "error",
          autoClose: false,
          pauseOnHover: true,
        });
        console.log(error);
      });
  };

    const formattedEnquiries = debitEnquiries.map((e) => ({
  ...e,
  label: `${e.acctName} >> ${e.product}`,
}));

   const formattedCreditEnquiries = creditEnquiries.map((e) => ({
  ...e,
  label: `${e.acctName} >> ${e.product}`,
}));
  return (
    <div className="mt-3">
      <div
        style={{
          backgroundColor: "#F4FAFD",
          borderRadius: "15px 15px 0 0",
        }}
        className="p-3"
      >
        <h5 style={{fontSize:'16px', color:'#333'}}>Transfer</h5>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form>
          <div
            className="bg-white px-3 pb-4 pt-2"
            style={{
              borderRadius: "0",
              border: "solid .5px #fafafa",
              borderBlock: "0",
            }}
          >
            <div className="admin-task-forms mb-4">
              <div className="d-flex flex-column gap-1">
                <label htmlFor="debitOptions">
                  Select payment mode for debit account
                </label>
                <select
                  name={debitOption}
                  value={debitOption}
                  onChange={(e) => setDebitOption(e.target.value)}
                  as="select"
                  className="w-100"
                >
                  <option value="">Select option</option>
                  {options.map((option) => (
                    <option value={option.value} key={option.name} style={{textTransform:'lowercase'}}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="debitAccount">Debit account number</label>
                   <Combobox
                      data={formattedEnquiries}
                      value={debitAccount}
                      onChange={(val) => setDebitAccount(val.accountNumber)}
                      valueField="accountNumber"
                      textField="label"
                      filter="contains"
                       />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="creditOptions">
                  Select payment mode for credit account
                </label>
                <select
                  name={creditOption}
                  value={creditOption}
                  onChange={(e) => setCreditOption(e.target.value)}
                  as="select"
                  className="w-100"
                >
                  <option value="">Select option</option>
                  {options.map((option) => (
                    <option value={option.value} key={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="creditAccount">Credit account number</label>
                     <Combobox
                      data={formattedCreditEnquiries}
                      value={creditAccount}
                      onChange={(val) => setCreditAccount(val.accountNumber)}
                      valueField="accountNumber"
                      textField="label"
                      filter="contains"
                   />
              </div>
               <div className="d-flex flex-column gap-1">
                <label htmlFor="paymentAmount">Enter payment amount</label>
                <input
                  name={paymentAmount}
                  value={paymentAmount}
                  type="number"
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="payVoucher">
                  Enter pay voucher/instrument number
                </label>
                <input name="payVoucher" value={batchNo} readOnly />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="creditAccount">Value date</label>
                <Field name="valueDate" type='date' />
              </div>
              <div className="d-flex gap-2 flex-column">
                <label htmlFor="currency">Currency</label>
                <Field name="currency" as="select">
                  <option value="">Select currency</option>
                  {currencies.map((currency) => (
                    <option
                      value={currency.countryCode}
                      key={currency.currencyName}
                    >
                      {currency.currencyName}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="currency" component={ErrorText} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="rate">Rate</label>
                <Field name="rate" value={1}/>
                <ErrorMessage name="rate" component={ErrorText} />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="transferAmount">Payment Amount</label>
                <input name="transferAmount" value={paymentAmount} readOnly />
              </div>
              <div className="d-flex flex-column gap-1">
                <label htmlFor="paymentDescription">Payment description</label>
                <Field name="paymentDescription" as="textarea" required/>
                <ErrorMessage
                  name="paymentDescription"
                  component={<ErrorText />}
                />
              </div>
            </div>
            <div className="accounting-form-container mx-1">
              <div
                className="d-flex flex-column gap-2 pb-3 px-0"
                style={{ boxShadow: "3px 3px 3px 3px #ddd", borderRadius:'10px 10px 0 0' }}
              >
                <div style={{ backgroundColor: "#EDF4FF", paddingTop: "10px", paddingInline:'15px',
                   borderRadius:'10px 10px 0 0' }}>
                  <p>Debit Account Info</p>
                </div>
                <div className="d-flex flex-column px-3 gap-2">
                <div className="d-flex gap-3 discourse">
                  <span>Account Name</span>
                  <p>{debitDetails?.accountTitle}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Product Name</span>
                  <p>{debitDetails?.prodName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Branch</span>
                  <p>{debitDetails?.branch}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Book Balance</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(debitDetails?.bkbal)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Effective Balance</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(debitDetails?.effbal)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Usable Balance</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(debitDetails?.usebal)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Source Type</span>
                  <p>{debitDetails?.acctty}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Source</span>
                  <p>{debitDetails?.source}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Account Status</span>
                  <p>{debitDetails?.acctStatus}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Total Charge</span>
                  <p>{debitDetails?.totalCharge}</p>
                </div>
              </div>
              </div>
              <div
                className="d-flex flex-column gap-2 pb-3 px-0"
                style={{ boxShadow: "3px 3px 3px 3px #ddd", borderRadius:'10px 10px 0 0' }}
              >
                <div style={{ backgroundColor: "#FEF3E6", paddingTop: "10px", paddingInline:'15px', borderRadius:'10px 10px 0 0' }}>
                  <p>Credit Account Info</p>
                </div>
                <div className="d-flex flex-column gap-2 px-3">
                <div className="d-flex gap-3 discourse">
                  <span>Account Name</span>
                  <p>{creditDetails?.accountTitle}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Product Name</span>
                  <p>{creditDetails?.prodName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Branch</span>
                  <p>{creditDetails?.branch}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Book Balance</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(creditDetails?.bkbal)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Effective Balance</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(creditDetails?.effbal)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Usable Balance</span>
                  <p>{new Intl.NumberFormat('en-US', {minimumFractionDigits:2}).format(creditDetails?.usebal)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Source Type</span>
                  <p>{creditDetails?.acctty}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Source</span>
                  <p>{creditDetails?.source}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Account Status</span>
                  <p>{creditDetails?.acctStatus}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Total Charge</span>
                  <p>{creditDetails?.totalCharge}</p>
                </div>
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
              className="border-0 px-2 btn-md rounded-5"
              style={{ backgroundColor: "#f7f7f7" }}
            >
              Discard
            </button>
            <button type="submit" className="border-0 btn-smd member" disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </Form>
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default Transfer;
