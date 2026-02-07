import React, { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";

const Status = () => {
  const [accounts, setAccounts] = useState([]);
  const [details, setDetails] = useState([]);
  const [account, setAccount] = useState("");
  const { credentials } = useContext(UserContext);

  const getAccounts = () => {
    axios("Acounting/general-ledger-customer-enquiry?SearchOption=3", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setAccounts(resp.data.data));
  };

  useEffect(() => {
    getAccounts();
  }, []);

  const getDetails = () => {
    axios(`LoanApplication/get-loan-status?AccountNumber=${account}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setDetails(resp.data.data));
  };

  useEffect(() => {
    getDetails();
  }, [account]);

  return (
    <div className="mt-2 bg-white px-3 py-3 rounded-4">
      <div className="mb-4 mt-2">
        <span className="active-selector">Loan Status</span>
      </div>
      <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
        <div
          className="py-3 px-4 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
        >
          <span style={{ fontWeight: "500", fontSize: "16px" }}>Loan Status</span>
        </div>
        <div>
          <div className="px-3 admin-task-forms  bg-white pt-2 pb-4">
            <div className="d-flex flex-column g-2 ">
              <label htmlFor="acctNumber" style={{ fontWeight: "500" }}>
                Select Account Number<sup className="text-danger">*</sup>
              </label>
              <select
                name="account"
                onChange={(e) => setAccount(e.target.value)}
              >
                <option value="">Select account number</option>
                {accounts.map((account) => (
                  <option value={account.accountNumber} key={account.id}>
                    {`${account.acctName}  >> ${account.accountNumber} >> ${account.product}`}{" "}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="px-3 mb-4">
          <div
            className="d-flex flex-column gap-2 pb-3 px-0"
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
              <p>Loan Account Details</p>
            </div>
            <div className="accounting-form-container ">
              <div className="d-flex flex-column gap-2 px-3">
                <div className="d-flex gap-3 discourse">
                  <span>Account Number:</span>
                  <p>{details?.loanAccountDetail?.accountNumber}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Account Title:</span>
                  <p>{details?.loanAccountDetail?.accountTitle}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Settlement Account Number:</span>
                  <p>{details?.loanAccountDetail?.settlementAccount}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Branch:</span>
                  <p>{details?.loanAccountDetail?.branch}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Product Code:</span>
                  <p>{details?.loanAccountDetail?.productCode}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Product Name:</span>
                  <p>{details?.loanAccountDetail?.productName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Currency:</span>
                  <p>{details?.loanAccountDetail?.currency}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Amount:</span>
                  <p>{new Intl.NumberFormat('en-US', {}).format(details?.loanAccountDetail?.loanAmount)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Term:</span>
                  <p>{details?.loanAccountDetail?.loanTerm}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Interest Rate:</span>
                  <p>{details?.loanAccountDetail?.interestRate}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Purpose:</span>
                  <p>{details?.loanAccountDetail?.loanPurpose}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Repayment Type:</span>
                  <p>{details?.loanAccountDetail?.repaymentType}</p>
                </div>
              </div>
              <div className="d-flex flex-column gap-2 px-3">
                <div className="d-flex gap-3 discourse">
                  <span>Term Remaining:</span>
                  <p>{details?.loanAccountDetail?.termRemaining}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Repay Mode:</span>
                  <p>{details?.loanAccountDetail?.repayMode}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Calculation Method:</span>
                  <p>{details?.loanAccountDetail?.calculationMethod}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Schedule Description:</span>
                  <span>
                    {details?.loanAccountDetail?.loanScheduleDescription}
                  </span>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>First Payment Date:</span>
                  <p>{details?.loanAccountDetail?.firstPaymentDate}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Start Date:</span>
                  <p>{details?.loanAccountDetail?.startDate}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Maturity Date:</span>
                  <p>{details?.loanAccountDetail?.maturityDate}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Total no of installments:</span>
                  <span>
                    {details?.loanAccountDetail?.totalNoOfInstallment}
                  </span>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Principal Due:</span>
                  <p>{new Intl.NumberFormat('en-US', {}).format(details?.loanAccountDetail?.principalDue)}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Interest Due:</span>
                  <p>{details?.loanAccountDetail?.interestDue}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Status:</span>
                  <p>{details?.loanAccountDetail?.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive px-3 mb-4">
          <h4 style={{ fontSize: "16px", fontWeight: "400" }}>
            Loan Schedule Information
          </h4>
          <table className="table" id="customers">
            <thead>
              <tr>
                <th>Due Date</th>
                <th>Principal Repayment</th>
                <th>Interest Repayment</th>
                <th>Total Repayment</th>
                <th>Balance (P&I)</th>
                <th>Pay Order</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {details?.loanScheduleDetails?.map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.date_due}</td>
                  <td>{new Intl.NumberFormat('en-US', {}).format(schedule.principalRepayment)}</td>
                  <td>{new Intl.NumberFormat('en-US', {}).format(schedule.interestRepayment)}</td>
                  <td>{new Intl.NumberFormat('en-US', {}).format(schedule.totalRepayment)}</td>
                  <td>{new Intl.NumberFormat('en-US', {}).format(schedule.balance)}</td>
                  <td>{schedule.payOrder}</td>
                  <td>{schedule.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-responsive px-3">
          <h4 style={{ fontSize: "16px", fontWeight: "400" }}>
            Guarantors Information
          </h4>
          <table className="table" id="customers">
            <thead>
              <tr>
                <th>Guarantor Member ID</th>
                <th>Guarantor Name</th>
                <th>Guarantor Email</th>
              </tr>
            </thead>
            <tbody>
              {details?.loanGuarantors?.map((guarantor) => (
                <tr>
                  <td>{guarantor.guarantorMemberId}</td>
                  <td>{guarantor.guarantorName}</td>
                  <td>{guarantor.guarantorEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Status;
