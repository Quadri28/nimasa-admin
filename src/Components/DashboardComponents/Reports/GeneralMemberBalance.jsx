import { UserContext } from '../../AuthContext';
import axios from '../../axios';
import React, { useContext, useEffect, useState } from 'react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const GeneralMemberBalance = () => {
  const [reports, setReports] = useState([]);
  const [date, setDate] = useState('');
  const { credentials } = useContext(UserContext);

  const getGeneralMemberBalance = () => {
    if (!date) return;
    axios(`Reports/General-member-balance?GeneralMemberBalanceReportAsAtDate=${date}`, {
      headers: {
        Authorization: `Bearer ${credentials.token}`,
      },
    }).then((resp) =>
      setReports(resp.data.data.generalMemberBalances || [])
    );
  };

  useEffect(() => {
    getGeneralMemberBalance();
  }, [date]);

  const groupedLoans = [...new Set(reports?.map((item) => item.productName))];

  const groupedData = reports?.reduce((acc, loan) => {
    (acc[loan.employeeId] = acc[loan.employeeId] || []).push(loan);
    return acc;
  }, {});

  // Column totals
  const columnTotals = {};
  groupedLoans.forEach((productName) => {
    columnTotals[productName] = reports
      .filter((loan) => loan.productName === productName)
      .reduce((sum, loan) => sum + (Number(loan.balance) || 0), 0);
  });

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // 🔽 EXPORT FUNCTION
  const exportToExcel = () => {
    if (!reports.length) return alert("No data to export!");

    // Build the export data
    const exportData = Object.keys(groupedData).map((employeeId) => {
      const employeeLoans = groupedData[employeeId];
      const firstLoan = employeeLoans[0];
      const row = {
        "Employee ID": firstLoan.employeeId,
        "Employee Name": firstLoan.employeeName,
      };

      let total = 0;
      groupedLoans.forEach((productName) => {
        const loan = employeeLoans.find(l => l.productName === productName);
        const balance = loan ? Number(loan.balance) : 0;
        row[productName] = balance;
        total += balance;
      });
      row["Total"] = total;
      return row;
    });

    // Add total row at bottom
    const totalRow = {
      "Employee ID": "",
      "Employee Name": "TOTAL",
    };
    groupedLoans.forEach((productName) => {
      totalRow[productName] = columnTotals[productName];
    });
    totalRow["Total"] = Object.values(columnTotals).reduce((sum, val) => sum + val, 0);
    exportData.push(totalRow);

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "General Member Balance");

    // Export the file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `GeneralMemberBalance_${date || "Report"}.xlsx`);
  };

  return (
    <div className="card p-3 mt-3 admin-task-forms rounded-4">
      <div className="d-flex gap-3 align-items-center flex-sm-row justify-content-between">
        <div className="d-flex flex-column gap-1 w-50">
          <label htmlFor="data">As at date:</label>
          <input
            type="date"
            name="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          />
        </div>

        <button
          onClick={exportToExcel}
          className="btn btn-md rounded-4 text-white px-4 fs-6"
          style={{ backgroundColor: "var(--custom-color)" }}
        >
          Export Excel
        </button>
      </div>

      <div
        className="table-responsive mt-3"
        id="customers"
        style={{ fontSize: '14px' }}
      >
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              {groupedLoans?.map((report) => (
                <th key={report} className='text-capitalize'>{report}</th>
              ))}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).map((employeeId) => {
              const employeeLoans = groupedData[employeeId];
              const firstLoan = employeeLoans[0];
              let rowTotal = 0;

              return (
                <tr key={employeeId}>
                  <td>{firstLoan.employeeId}</td>
                  <td>{firstLoan.employeeName}</td>
                  {groupedLoans.map((productName, idx) => {
                    const loan = employeeLoans.find(
                      (l) => l.productName === productName
                    );
                    const balance = loan ? Number(loan.balance) : 0;
                    rowTotal += balance;
                    return <td key={idx}>{currencyFormatter.format(balance)}</td>;
                  })}
                  <td>{currencyFormatter.format(rowTotal)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="2">Total</th>
              {groupedLoans.map((productName, idx) => (
                <th key={idx}>
                  {currencyFormatter.format(columnTotals[productName])}
                </th>
              ))}
              <th>
                {currencyFormatter.format(
                  Object.values(columnTotals).reduce((sum, val) => sum + val, 0)
                )}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default GeneralMemberBalance;
