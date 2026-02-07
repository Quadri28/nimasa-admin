import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ErrorText from "../ErrorText";
import * as Yup from "yup";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import { Combobox } from "react-widgets/cjs";

const CloseAccount = () => {
  const { credentials } = useContext(UserContext);
  const [accounts, setAccounts] = useState([]);
  const [accts, setAccts] = useState([]);
  const [accountNumber, setAccountNumber] = useState(null);
  const [closeAccountNumbers, setCloseAccountNumbers] = useState({});

  const getAccts = () => {
    axios("MemberManagement/account-enquiry", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setAccts(resp.data.data));
  };

  const getAccounts = () => {
    axios("MemberManagement/get-closure-account", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setAccounts(resp.data.data));
  };
  const closeAccount = () => {
    axios(
      `MemberManagement/close-account-account-number-text-changed?AccountNumber=${accountNumber}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    ).then((resp) => setCloseAccountNumbers(resp.data.data.bankAccount));
  };
  useEffect(() => {
    getAccounts();
    getAccts();
  }, []);

  useEffect(() => {
    if (accountNumber) {
      closeAccount();
    }
  }, [accountNumber]);

  const initialValues = {
    totalCharge: 0,
    valueDate: "",
    narration: "",
    accountNumberBalanceMovedTo: "",
  };
  const validationSchema = Yup.object({
    totalCharge: Yup.string().required().label("Total Charge"),
    valueDate: Yup.string().required().label("Value Date"),
    narration: Yup.string().label("Narration"),
    accountNumberBalanceMovedTo: Yup.string()
      .required()
      .label("Account Number"),
  });
  const onSubmit = (values) => {
    const payload = {
      accountNumber: accountNumber,
      totalCharge: Number(closeAccountNumbers.totalCharge),
      valueDate: values.valueDate,
      narration: closeAccountNumbers.narration,
      accountNumberBalanceMovedTo: values.accountNumberBalanceMovedTo,
      drInterest: closeAccountNumbers.drInterest,
      crInterest: closeAccountNumbers.crInterest,
      usableBalance: closeAccountNumbers.usableBalance,
    };
    axios
      .post("MemberManagement/close-account", payload, {
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
      .catch((error) => {
        toast(error.response.data.message, {
          type: "error",
          autoClose: false,
          pauseOnHover: true,
        });
      });
  };

  const formattedInfo = accts.map((e) => ({
    ...e,
    label: `${e.fullName} >> ${e.accountNumber}`,
  }));

  return (
    <div
      style={{
        border: "solid 1px #f7f4fa",
        borderRadius: "15px",
        marginTop: "1.5rem",
      }}
    >
      <div
        style={{ backgroundColor: "#F5F9FF", borderRadius: "15px 15px 0 0" }}
        className="p-3"
      >
        <h6>Close Account</h6>
      </div>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        <Form>
          <div className="px-3  mt-3 admin-task-forms">
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="accountNumber">Account Number:</label>
              <Combobox
                data={formattedInfo}
                value={accountNumber}
                valueField="accountNumber"
                textField="label" 
                filter="contains"
                onChange={(val) => {
                  if (val && typeof val === "object") {
                    setAccountNumber(val.accountNumber);
                  } else {
                    setAccountNumber(val); 
                  }
                }}
              />
            </div>
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="totalCharge">Total Charge:</label>
              <NumericFormat
                name="totalCharge"
                value={closeAccountNumbers.totalCharge}
                decimalScale={2}
                fixedDecimalScale
              />
              <ErrorMessage name="totalCharge" component={ErrorText} />
            </div>
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="valueDate">Value Date:</label>
              <Field name="valueDate" type="date" />
              <ErrorMessage name="valueDate" component={ErrorText} />
            </div>
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="accountNumberBalanceMovedTo">
                Account Balance Moved To?:
              </label>
              <Field name="accountNumberBalanceMovedTo" as="select">
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option value={account.glNumber} key={account.glNumber}>
                    {account.acctName}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="accountNumberBalanceMovedTo"
                component={ErrorText}
              />
            </div>
          </div>
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
                  <p>{closeAccountNumbers?.accountName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Product Name:</span>
                  <p>{closeAccountNumbers?.productName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Branch:</span>
                  <p>{closeAccountNumbers?.branch}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Book Balance:</span>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(closeAccountNumbers?.bookBalance)}
                  </p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Effective Balance:</span>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(closeAccountNumbers?.effectiveBalance)}
                  </p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Usable Balance:</span>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(closeAccountNumbers?.usableBalance)}
                  </p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Source Type:</span>
                  <p>{closeAccountNumbers?.sourceType}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Source:</span>
                  <p>{closeAccountNumbers?.source}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Account Status:</span>
                  <p>{closeAccountNumbers?.accountStatus}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Total Charge</span>
                  <p>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(closeAccountNumbers?.totalCharge)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 pt-2">
            <div className="d-flex flex-column gap-1 ">
              <label htmlFor="narration">Narration:</label>
              <Field
                name="narration"
                value={closeAccountNumbers.narration}
                as="textarea"
                style={{
                  outlineColor: "#69A4FC",
                  outlineWidth: ".2px",
                  border: "none",
                  backgroundColor: "#F5F5F5",
                  borderRadius: "12px",
                  padding: "10px",
                  fontSize: "14px",
                }}
              />
              <ErrorMessage name="narration" component={ErrorText} />
            </div>
          </div>
          <div
            className="d-flex gap-3 justify-content-end p-3 mt-5"
            style={{
              backgroundColor: "#f2f2f2",
              borderRadius: "0 0 10px 10px",
              fontSize: "13px",
            }}
          >
            <button
              type="reset"
              className="border-0 rounded-5 px-3 btn-md"
              style={{ backgroundColor: "#f7f4fa", fontSize:'14px' }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="border-0 member btn-md"
              style={{ backgroundColor: "var(--custom-color)", fontSize:'14px' }}
            >
              Submit
            </button>
          </div>
        </Form>
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default CloseAccount;
