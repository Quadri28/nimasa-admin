import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../AuthContext";
import axios from "../../axios";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { LiaTimesCircle } from "react-icons/lia";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TrialBalanceCurrent = () => {
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("");
  const { credentials } = useContext(UserContext);
  const [reports, setReports] = useState([]);
  const [openProductTypes, setOpenProductTypes] = useState([]);
  const [openGLClasses, setOpenGLClasses] = useState([]);

  const toggleProductType = (name) => {
    setOpenProductTypes((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const toggleGLClass = (name) => {
    setOpenGLClasses((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const getReports = () => {
    axios(`Reports/trial-balance-current?BranchCode=${branch}`, {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => {
      if (resp.data.data.trialBalanceCurrents) {
        setReports(resp.data.data.trialBalanceCurrents);
      }
    });
  };

  const getBranches = () => {
    axios("MemberManagement/get-branch", {
      headers: { Authorization: `Bearer ${credentials.token}` },
    }).then((resp) => {
      setBranches(resp.data.data);
    });
  };

  useEffect(() => {
    getBranches();
  }, []);

  useEffect(() => {
    if (branch) getReports();
  }, [branch]);

  const allLoans = reports.flatMap((r) => r.trialBalanceCurrents || []);
  const grandTotalDebit = allLoans.reduce(
    (sum, item) => sum + Number(item.debitAcct || 0),
    0
  );
  const grandTotalCredit = allLoans.reduce(
    (sum, item) => sum + Number(item.creditAcct || 0),
    0
  );

  const handleExport = () => {
  if (reports.length === 0) {
    alert("No data to export!");
    return;
  }

  const sheetData = [];

  reports.forEach((report) => {
    // Product type header
    sheetData.push([`${report.prodTypeName}`]);

    // Group by GL class
    const groupedLoans = report.trialBalanceCurrents?.reduce((acc, loan) => {
      (acc[loan.glClassName] = acc[loan.glClassName] || []).push(loan);
      return acc;
    }, {});

    Object.keys(groupedLoans).forEach((glClassName) => {
      sheetData.push([`  ${glClassName}`]);
      sheetData.push(["    GL Account No", "Account Name", "Debit", "Credit"]);

      groupedLoans[glClassName].forEach((loan) => {
        sheetData.push([
          `    ${loan.glNumber}`,
          loan.acctName,
          Number(loan.debitAcct || 0),
          Number(loan.creditAcct || 0),
        ]);
      });

      sheetData.push([]);
    });

    // Subtotals
    const totalDebit = report.trialBalanceCurrents.reduce(
      (sum, item) => sum + Number(item.debitAcct || 0),
      0
    );
    const totalCredit = report.trialBalanceCurrents.reduce(
      (sum, item) => sum + Number(item.creditAcct || 0),
      0
    );

    sheetData.push([
      "",
      `Total for ${report.prodTypeName}`,
      totalDebit,
      totalCredit,
    ]);

    sheetData.push([]);
  });

  sheetData.push([
    "",
    "Grand Total",
    grandTotalDebit,
    grandTotalCredit,
  ]);

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  ws["!cols"] = [
    { wch: 25 },
    { wch: 40 },
    { wch: 15 },
    { wch: 15 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([wbout], { type: "application/octet-stream" }),
    `Trial_Balance_${branch || "All"}.xlsx`
  );
};


  return (
    <div className="p-3 mt-3 rounded-4" style={{ border: "solid .5px #f2f2f2" }}>
      <div className="admin-task-forms g-2 justify-content-between d-flex align-items-center">
        <div className="d-flex flex-column gap-1 w-50">
          <label htmlFor="branch">
            Select Branch<sup className="text-danger">*</sup>
          </label>
          <select
            name={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="p-2 border-0 rounded-3"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option value={branch.branchCode} key={branch.branchName}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExport}
          className="btn btn-md px-4 rounded-5 text-white"
         style={{ backgroundColor: "var(--custom-color)" }}
        >
          Export to Excel
        </button>
      </div>

      <div className="table-responsive mt-3" id="customers">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>GL Account No</th>
              <th>Account Name</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>

          {reports.map((report) => {
            const groupedLoans = report?.trialBalanceCurrents?.reduce((acc, loan) => {
              (acc[loan.glClassName] = acc[loan.glClassName] || []).push(loan);
              return acc;
            }, {});

            const totalDebit = report.trialBalanceCurrents?.reduce(
              (sum, item) => sum + Number(item.debitAcct || 0),
              0
            );
            const totalCredit = report.trialBalanceCurrents?.reduce(
              (sum, item) => sum + Number(item.creditAcct || 0),
              0
            );

            return (
              <tbody key={report?.prodTypeName}>
                <tr onClick={() => toggleProductType(report?.prodTypeName)}>
                  <td
                    colSpan="4"
                    style={{
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: "5px",
                      color: "var(--custom-color)",
                      backgroundColor: "#F5F9FF",
                    }}
                  >
                    {openProductTypes.includes(report?.prodTypeName) ? (
                      <FaAngleUp style={{ color: "#000" }} />
                    ) : (
                      <FaAngleDown />
                    )}{" "}
                    {report?.prodTypeName}
                  </td>
                </tr>

                {openProductTypes.includes(report?.prodTypeName) &&
                  Object.keys(groupedLoans).map((glClassName) => (
                    <React.Fragment key={glClassName}>
                      <tr onClick={() => toggleGLClass(glClassName)}>
                        <td
                          colSpan="4"
                          style={{
                            fontSize: "12px",
                            cursor: "pointer",
                            padding: "5px 0",
                            border: "solid 1px #ddd",
                            color: "black",
                          }}
                        >
                          {openGLClasses.includes(glClassName) ? (
                            <FaAngleUp />
                          ) : (
                            <FaAngleDown />
                          )}{" "}
                          {glClassName}
                        </td>
                      </tr>

                      {openGLClasses.includes(glClassName) &&
                        groupedLoans[glClassName].map((loan) => (
                          <tr key={loan.glNumber}>
                            <td>{loan.glNumber}</td>
                            <td>{loan.acctName}</td>
                            <td>
                              {new Intl.NumberFormat("en-US", {
                                minimumFractionDigits: 2,
                              }).format(loan.debitAcct)}
                            </td>
                            <td>
                              {new Intl.NumberFormat("en-US", {
                                minimumFractionDigits: 2,
                              }).format(loan.creditAcct)}
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}

                <tr
                  style={{ fontWeight: "bold", backgroundColor: "#EAF4FF" }}
                >
                  <td colSpan="2" className="text-end">
                    Total for {report?.prodTypeName}
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(totalDebit)}
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-US", {
                      minimumFractionDigits: 2,
                    }).format(totalCredit)}
                  </td>
                </tr>
              </tbody>
            );
          })}

          <tfoot>
            <tr style={{ fontWeight: "bold", backgroundColor: "#DDF5E8" }}>
              <td colSpan="2" className="text-end">
                Grand Total
              </td>
              <td>
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                }).format(grandTotalDebit)}
              </td>
              <td>
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                }).format(grandTotalCredit)}
              </td>
            </tr>
          </tfoot>
        </table>

        {reports.length < 1 && (
          <div className="d-flex justify-content-center flex-column">
            <LiaTimesCircle className="mx-auto" size={30} />
            <p className="text-center">No record yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialBalanceCurrent;
