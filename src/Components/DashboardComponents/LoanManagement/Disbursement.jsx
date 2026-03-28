import React, { useContext, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "../../axios";
import { UserContext } from "../../AuthContext";
import { Combobox } from "react-widgets/cjs";
import Table from "../CommunicationSubComponents/Table";
import Modal from "react-modal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Disbursement = () => {
  const [members, setMembers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [account, setAccount] = useState([]);
  const [data, setData] = useState({});
  const [active, setActive] = useState("single");
  const [input, setInput] = useState({
    loanAcct: "",
    disbursedDate: "",
    disbursementMode: "",
  });
  const { credentials } = useContext(UserContext);
  const getMembers = () => {
    axios("Acounting/general-ledger-customer-enquiry?SearchOption=2", {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) => setMembers(resp.data.data));
  };
  useEffect(() => {
    getMembers();
  }, []);

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };
  const getAccountDetails = () => {
    axios(
      `LoanApplication/get-loan-accounts-by-customerId?CustomerId=${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      },
    ).then((resp) => setAccount(resp.data.data));
  };
  useEffect(() => {
    getAccountDetails();
  }, [customerId]);

  const getData = () => {
    axios(
      `LoanApplication/validate-selected-loan-account-for-loan-disbursement?LoanAccountNo=${input.loanAcct}&CustomerId=${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      },
    ).then((resp) => setData(resp.data.data));
  };
  useEffect(() => {
    if (customerId && input?.loanAcct) {
    getData();
    }
  }, [customerId, input?.loanAcct]);

  const disburseLoan = (e) => {
    e.preventDefault();
    const payload = {
      customerId: customerId,
      loanAccountNo: input.loanAcct,
      settleAccountNumber: data.settleAccountNumber,
      dateDisbursed: input.disbursedDate,
      disbursementMode: input.disbursementMode,
      repaymentType: data.repaymentType,
      loanAmount: Number(data.loanAmount),
      applicationNo: data.applicationNo,
    };
    axios
      .post("LoanApplication/loan-disbursement", payload, {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      })
      .then((resp) =>
        toast(resp.data.message, {
          type: "success",
          autoClose: 5000,
          pauseOnHover: true,
        }),
      )
      .catch((error) =>
        toast(error.response.data.message, { type: "error", autoClose: false }),
      );
  };

  return (
    <div className="mt-4 bg-white px-3 py-3 rounded-4">
      <div className="mt-2 mb-4 d-flex gap-3">
        <span
          className={active === "single" ? "active-selector" : ""}
          style={{ cursor: "pointer" }}
          onClick={() => setActive("single")}
        >
          Loan Disbursement
        </span>
        <span
          className={active === "bulk" ? "active-selector" : ""}
          style={{ cursor: "pointer" }}
          onClick={() => setActive("bulk")}
        >
          Bulk Loan Disbursement
        </span>
      </div>
      {active === "single" ? (
        <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
          <div
            className="py-3 px-4 justify-content-between align-items-center d-flex"
            style={{
              backgroundColor: "#f4fAfd",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <span
              style={{ fontWeight: "500", fontSize: "16px", color: "#333" }}
            >
              Loan Disbursement
            </span>
          </div>
          <form onSubmit={disburseLoan}>
            <div>
              <div className="px-3 admin-task-forms  bg-white py-4">
                <div className="d-flex flex-column gap-1 ">
                  <label htmlFor="customerID" style={{ fontWeight: "500" }}>
                    Customer ID<sup className="text-danger">*</sup>
                  </label>
                  <Combobox
                    data={members}
                    value={customerId}
                    valueField="id"
                    textField="acctName"
                    filter="contains"
                    onChange={(val) => setCustomerId(val.id)}
                  />
                </div>
                <div className="d-flex flex-column gap-1">
                  <label htmlFor="disbursedDate" style={{ fontWeight: "500" }}>
                    Disbursed Date<sup className="text-danger">*</sup>
                  </label>
                  <input
                    name="disbursedDate"
                    id="disbursedDate"
                    onChange={changeHandler}
                    type="date"
                  />
                </div>
                <div className="d-flex flex-column gap-1 ">
                  <label htmlFor="loanAcct" style={{ fontWeight: "500" }}>
                    Loan Account<sup className="text-danger">*</sup>
                  </label>
                  <select
                    name="loanAcct"
                    id="loanAcct"
                    onChange={changeHandler}
                  >
                    <option value="">Select</option>
                    {account.map((acct) => (
                      <option value={acct.accountNo} key={acct.accountNo}>
                        {acct.accountDescription}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex flex-column gap-1 ">
                  <label
                    htmlFor="disbursementMode"
                    onChange={changeHandler}
                    style={{ fontWeight: "500" }}
                  >
                    Disbursement Mode<sup className="text-danger">*</sup>
                  </label>
                  <select name="disbursementMode" onChange={changeHandler}>
                    <option value="">Select</option>
                    <option value="1">Cash</option>
                    <option value="2">Cheque</option>
                    <option value="3">Bank</option>
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
                      <span>Settlement Account Number:</span>
                      <p>{data?.settlementAccountNumber}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Settlement Account Name:</span>
                      <p>{data?.settlementAccountName}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Branch:</span>
                      <p>{data?.branch}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Loan Type:</span>
                      <p>{data?.loanType}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Loan Amount:</span>
                      <p>{data?.loanAmount}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Loan Term:</span>
                      <p>{data?.loanTerm}</p>
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-2 px-3">
                    <div className="d-flex gap-3 discourse">
                      <span>Loan Rate:</span>
                      <p>{data?.loanRate}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Loan Status:</span>
                      <p>{data?.status}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Repayment Type:</span>
                      <p>{data?.repaymentType}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Calculation Method:</span>
                      <p>{data?.calculationMethod}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Start Date:</span>
                      <p>{data?.startDate}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Maturity Date:</span>
                      <p>{data?.maturityDate}</p>
                    </div>
                    <div className="d-flex gap-3 discourse">
                      <span>Charges:</span>
                      <p>
                        {data?.charges?.map((charge) => (
                          <p>{charge.chargeType}</p>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive px-3 mb-4">
              <table className="table" id="customers">
                <thead>
                  <tr>
                    <th>Due Date</th>
                    <th>Principal Repayment</th>
                    <th>Interest Repayment</th>
                    <th>Total Repayment</th>
                    <th>Balance (P&I)</th>
                    <th>Pay Order</th>
                    <th>Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.loanSchedultAccounts?.map((schedule) => (
                    <tr key={schedule.id}>
                      <td>{schedule.dueDate}</td>
                      <td>{schedule.principalRepayment}</td>
                      <td>{schedule.interestRepayment}</td>
                      <td>{schedule.totalRepayment}</td>
                      <td>{schedule.balance}</td>
                      <td>{schedule.payOrder}</td>
                      <td>{schedule.schedule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="d-flex justify-content-end gap-3 py-4 px-2"
              style={{
                backgroundColor: "#FAFAFA",
                borderRadius: "0 0 10px 10px",
              }}
            >
              <button
                className="btn btn-md rounded-5 py-1 px-3"
                style={{ backgroundColor: "#F7F7F7" }}
                type="reset"
              >
                Discard
              </button>
              <button
                className="btn btn-md text-white rounded-5"
                style={{ backgroundColor: "#0452C8" }}
                type="submit"
              >
                Disburse
              </button>
            </div>
          </form>
        </div>
      ) : (
        <BulkLoanDisbursement />
      )}
      <ToastContainer />
    </div>
  );
};

export default Disbursement;

const BulkLoanDisbursement = () => {
  const [input, setInput] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [schedules, setScheduless] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [detail, setDetail] = useState({});

  const fetchIdRef = React.useRef(0);

  const changeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput({ ...input, [name]: value });
  };

  const { credentials } = useContext(UserContext);

  const fetchData = React.useCallback(({ pageSize, pageNumber, search }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        axios
          .get(
            `LoanApplication/get-loan-applications-for-disbursment?PageNumber=${
              pageNumber + 1
            }&PageSize=${pageSize}&Filter=${encodeURIComponent(search)}`,
            {
              headers: {
                Authorization: `Bearer ${credentials.token}`,
              },
            },
          )
          .then((resp) => {
            if (resp.data.data.modelResult) {
              setData(resp.data.data.modelResult);
              setPageCount(Math.ceil(resp.data.data.totalCount / pageSize));
            }
          });
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData({ pageSize, pageNumber, search: searchQuery });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, pageNumber, pageSize, fetchData]);

  const column = [
    {
      Header: () => (
        <div className="d-flex justify-content-center">
          <input
            type="checkbox"
            checked={selectedRows.length === data.length && data.length > 0}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              if (e.target.checked) {
                const allIds = data.map((row) => Number(row.id));
                setSelectedRows(allIds);
              } else {
                setSelectedRows([]);
              }
            }}
          />
        </div>
      ),
      accessor: "select",
      disableSortBy: true,
      Cell: ({ row }) => {
        const id = Number(row.original.id);

        return (
          <div className="d-flex justify-content-center">
            <input
              type="checkbox"
              checked={selectedRows.includes(id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRows((prev) => [...prev, id]);
                } else {
                  setSelectedRows((prev) => prev.filter((item) => item !== id));
                }
              }}
            />
          </div>
        );
      },
    },
    { Header: "Member ID", accessor: "customerId" },
    { Header: "Member Name", accessor: "applicationName" },
    { Header: "Loan Type", accessor: "productName" },
    { Header: "Loan Account", accessor: "accountNumber" },
    {
      Header: "View",
      accessor: "",
      Cell: ({ cell }) => {
        const id = cell.row.original.customerId
        const No = cell.row.original.accountNumber
        return <button className="member border-0"
        onClick={()=>{
          setIsOpen(true)
          setAccountNumber(No)
          setCustomerId(id)
        }}>View</button>;
      },
    },
  ];
  const columns = useMemo(() => column, [selectedRows, data]);

  const getData = () => {
    axios(
      `LoanApplication/validate-selected-loan-account-for-loan-disbursement?LoanAccountNo=${accountNumber}&CustomerId=${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      },
    ).then((resp) =>{
      setDetail(resp.data.data)
      setScheduless(resp?.data?.data?.loanSchedultAccounts)

    });
  };
  useEffect(() => {
    if (customerId && accountNumber) {
    getData();
    }
  }, [customerId, accountNumber]);

const disburseBulkLoan = async () => {
  const payload = {
    id: selectedRows,
    dateDisbursed: input.disbursedDate,
    disbursementMode: input.disbursementMode,
  };

  try {
    const resp = await axios.post(
      "LoanApplication/bulk-loan-disbursement",
      payload,
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    );

    //Show success message
    toast(resp.data.message, {
      autoClose: 5000,
      pauseOnHover: true,
      type: "success",
    });

    // Extract data array
    const reportData = resp?.data?.data || [];

    if (reportData.length === 0) {
      toast("No report data to export", { type: "info" });
      return;
    }

    // Create PDF
    const doc = new jsPDF();

    // Title
    doc.text("Loan Disbursement Report", 14, 15);

    // Prepare table
    const tableData = reportData.map((item) => [
      item.loanAccountId,
      item.loanAccountNumber,
      item.reportMessage,
    ]);

    autoTable(doc, {
      head: [["Loan Account ID", "Account Number", "Report Message"]],
      body: tableData,
      startY: 20,
    });

    doc.save("loan-disbursement-report.pdf");

  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Something went wrong";
    toast(message, {
      type: "error",
      autoClose: false,
    });
  }
};

  return (
    <>
      <div style={{ border: "solid 1px #fafafa" }} className="rounded-4">
        <div
          className="py-3 px-4 justify-content-between align-items-center d-flex"
          style={{ backgroundColor: "#f4fAfd", borderRadius: "10px 10px 0 0" }}
        >
          <span style={{ fontWeight: "500", fontSize: "16px", color: "#333" }}>
            Bulk Loan Disbursement
          </span>
        </div>
        <div className="px-3 admin-task-forms  bg-white py-4">
          <div className="d-flex flex-column gap-1">
            <label htmlFor="disbursedDate" style={{ fontWeight: "500" }}>
              Disbursed Date<sup className="text-danger">*</sup>
            </label>
            <input
              name="disbursedDate"
              id="disbursedDate"
              onChange={changeHandler}
              type="date"
            />
          </div>
          <div className="d-flex flex-column gap-1 ">
            <label
              htmlFor="disbursementMode"
              onChange={changeHandler}
              style={{ fontWeight: "500" }}
            >
              Disbursement Mode<sup className="text-danger">*</sup>
            </label>
            <select name="disbursementMode" onChange={changeHandler}>
              <option value="">Select</option>
              <option value="1">Cash</option>
              <option value="2">Cheque</option>
              <option value="3">Bank</option>
            </select>
          </div>
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
      </div>
      <div className="d-flex justify-content-end">
        <button className="member border-0" onClick={()=>disburseBulkLoan()}
         disabled={!input?.disbursedDate && !input?.disbursementMode && selectedRows.length > 1}>Disburse</button>
      </div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Example Modal"
        overlayClassName="loan-overlay"
        ariaHideApp={false}
        className="loan-modal rounded-3 card p-3"
      >
        <div className="px-3 mb-4">
          <p className="text-center fw-bold">Loan Account Details</p>
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
                  <span>Settlement Account Number:</span>
                  <p>{detail?.settlementAccountNumber}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Settlement Account Name:</span>
                  <p>{detail?.settlementAccountName}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Branch:</span>
                  <p>{detail?.branch}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Type:</span>
                  <p>{detail?.loanType}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Amount:</span>
                  <p>{detail?.loanAmount}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Term:</span>
                  <p>{detail?.loanTerm}</p>
                </div>
              </div>
              <div className="d-flex flex-column gap-2 px-3">
                <div className="d-flex gap-3 discourse">
                  <span>Loan Rate:</span>
                  <p>{detail?.loanRate}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Loan Status:</span>
                  <p>{detail?.status}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Repayment Type:</span>
                  <p>{detail?.repaymentType}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Calculation Method:</span>
                  <p>{detail?.calculationMethod}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Start Date:</span>
                  <p>{detail?.startDate}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Maturity Date:</span>
                  <p>{detail?.maturityDate}</p>
                </div>
                <div className="d-flex gap-3 discourse">
                  <span>Charges:</span>
                  <div>
                    {detail?.charges?.map((charge) => (
                      <p>{charge.chargeType}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="fw-bold mt-3">Loan Schedules:</p>

        <div className="table-responsive mb-3">
          <table className="table" id="customers">
            <thead>
              <tr>
                <th>Due Date</th>
                <th>Principal Repayment</th>
                <th>Interest Repayment</th>
                <th>Total Repayment</th>
                <th>Balance (P&I)</th>
                <th>Pay Order</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {schedules?.map((schedule, i) => (
                <tr key={i}>
                  <td>{schedule.dueDate}</td>
                  <td>{schedule.principalRepayment}</td>
                  <td>{schedule.interestRepayment}</td>
                  <td>{schedule.totalRepayment}</td>
                  <td>{schedule.balance}</td>
                  <td>{schedule.payOrder}</td>
                  <td>{schedule.schedule}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </Modal>
    </>
  );
};
