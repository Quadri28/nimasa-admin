
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../AuthContext';
import axios from '../../axios';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { LiaTimesCircle } from 'react-icons/lia';
import * as XLSX from "xlsx";

const TrialBalanceByDate = () => {
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState('');
  const [startDate, setStartDate] = useState('');
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
    axios(
      `Reports/trial-balance-by-data?BranchCode=${branch}&StartDate=${startDate}`,
      {
        headers: { Authorization: `Bearer ${credentials.token}` },
      }
    ).then((resp) => {
      if (resp.data.data.trialBalanceByDateReports) {
        setReports(resp.data.data.trialBalanceByDateReports);
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
    if (branch && startDate) {
      getReports();
    }
  }, [branch, startDate]);

  // Grand totals
  const allLoans = reports.flatMap(r => r.trialBalanceByDateReports || []);
  const grandTotalDebit = allLoans.reduce((s, i) => s + Number(i.debitAcct || 0), 0);
  const grandTotalCredit = allLoans.reduce((s, i) => s + Number(i.creditAcct || 0), 0);


  const exportToExcel = () => {
    let excelData = [];

    reports.forEach(report => {
      excelData.push({
        GL_Account_No: "",
        Account_Name: `PRODUCT TYPE: ${report.prodTypeName}`,
        Debit: "",
        Credit: ""
      });

      const groupedLoans = report.trialBalanceByDateReports?.reduce((acc, loan) => {
        (acc[loan.gl_ClassName] = acc[loan.gl_ClassName] || []).push(loan);
        return acc;
      }, {});

      Object.keys(groupedLoans).forEach(glClass => {
        excelData.push({
          GL_Account_No: "",
          Account_Name: `GL CLASS: ${glClass}`,
          Debit: "",
          Credit: ""
        });

        groupedLoans[glClass].forEach(loan => {
          excelData.push({
            GL_Account_No: loan.glNumber,
            Account_Name: loan.acctName,
            Debit: loan.debitAcct,
            Credit: loan.creditAcct
          });
        });
      });

      const totalDebit = report.trialBalanceByDateReports.reduce(
        (sum, item) => sum + Number(item.debitAcct || 0), 0
      );
      const totalCredit = report.trialBalanceByDateReports.reduce(
        (sum, item) => sum + Number(item.creditAcct || 0), 0
      );

      excelData.push({
        GL_Account_No: "",
        Account_Name: `TOTAL FOR ${report.prodTypeName}`,
        Debit: totalDebit,
        Credit: totalCredit
      });

      excelData.push({});
    });

    excelData.push({
      GL_Account_No: "",
      Account_Name: "GRAND TOTAL",
      Debit: grandTotalDebit,
      Credit: grandTotalCredit
    });

    // Convert to sheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Trial Balance");

    // Download file
    XLSX.writeFile(
      workbook,
      `Trial_Balance_${branch}_${startDate}.xlsx`
    );
  };

  return (
    <div className="p-3 mt-3 rounded-4" style={{ border: 'solid .5px #f2f2f2' }}>
      {/* Filters */}
      <div className="admin-task-forms g-2 justify-content-between">
        <div className="d-flex flex-column gap-1">
          <label>Select Branch<sup className="text-danger">*</sup></label>
          <select
            onChange={(e) => setBranch(e.target.value)}
            className="p-2 border-0 rounded-3"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option value={branch.branchCode} key={branch.Name}>
                {branch.branchName}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex flex-column gap-1 w-full">
          <label>As at Date:</label>
          <input
            type="date"
            className="rounded-3 p-2 w-full"
            style={{ border: 'solid 1px #ddd', height: '2.5rem' }}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* Export button */}
        <button
         className="btn btn-md px-4 rounded-3 text-white"
         style={{ backgroundColor: "var(--custom-color)" }}
          onClick={exportToExcel}
          disabled={!reports.length}
        >
          Export to Excel
        </button>
      </div>

      {/* TABLE */}
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
            const groupedLoans = report?.trialBalanceByDateReports?.reduce(
              (acc, loan) => {
                (acc[loan.gl_ClassName] = acc[loan.gl_ClassName] || []).push(loan);
                return acc;
              }, {}
            );

            const totalDebit = report.trialBalanceByDateReports?.reduce(
              (sum, item) => sum + Number(item.debitAcct || 0),
              0
            );
            const totalCredit = report.trialBalanceByDateReports?.reduce(
              (sum, item) => sum + Number(item.creditAcct || 0),
              0
            );

            return (
              <tbody key={report?.prodTypeName}>
                <tr onClick={() => toggleProductType(report?.prodTypeName)}>
                  <td colSpan="4" style={{ fontSize: "12px", cursor: "pointer", backgroundColor: "#F5F9FF" }}>
                    {openProductTypes.includes(report?.prodTypeName) ? (
                      <FaAngleUp />
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
                        <td colSpan="4" style={{ fontSize: "12px", cursor: "pointer", border: "solid 1px #ddd" }}>
                          {openGLClasses.includes(glClassName) ? <FaAngleUp /> : <FaAngleDown />}{" "}
                          {glClassName}
                        </td>
                      </tr>

                      {openGLClasses.includes(glClassName) &&
                        groupedLoans[glClassName].map((loan) => (
                          <tr key={loan.glNumber}>
                            <td>{loan.glNumber}</td>
                            <td>{loan.acctName}</td>
                            <td>{Number(loan.debitAcct).toLocaleString()}</td>
                            <td>{Number(loan.creditAcct).toLocaleString()}</td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}

                <tr style={{ fontWeight: "bold", backgroundColor: "#EAF4FF" }}>
                  <td colSpan="2" className="text-end">Total for {report?.prodTypeName}</td>
                  <td>{totalDebit.toLocaleString()}</td>
                  <td>{totalCredit.toLocaleString()}</td>
                </tr>
              </tbody>
            );
          })}

          <tfoot>
            <tr style={{ fontWeight: "bold", backgroundColor: "#DDF5E8" }}>
              <td colSpan="2" className="text-end">Grand Total</td>
              <td>{grandTotalDebit.toLocaleString()}</td>
              <td>{grandTotalCredit.toLocaleString()}</td>
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

export default TrialBalanceByDate;
