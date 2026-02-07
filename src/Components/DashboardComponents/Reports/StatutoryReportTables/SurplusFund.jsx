import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SurplusFund = ({ groupedLoans }) => {

  // ---------------------------------------------
  // EXPORT TO EXCEL
  // ---------------------------------------------
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    Object.keys(groupedLoans).forEach(reportName => {
      const data = groupedLoans[reportName].map(loan => ({
        "Description": loan.itemDescription,
        "%": loan.percentage,
        "This Year": loan.thisYear,
        "Last Year": loan.lastYear,
      }));

      const ws = XLSX.utils.json_to_sheet(data);

      // Sanitize sheet name (Excel does not allow : \ / ? * [ ])
      const safeSheetName = reportName.replace(/[:\\\/\?\*\[\]]/g, "").substring(0, 31);

      XLSX.utils.book_append_sheet(workbook, ws, safeSheetName);
    });

    XLSX.writeFile(workbook, `SurplusFund_Report.xlsx`);
  };


  // ---------------------------------------------
  // EXPORT TO PDF
  // ---------------------------------------------
  const exportToPDF = () => {
    const doc = new jsPDF();

    Object.keys(groupedLoans).forEach((reportName, idx) => {
      if (idx !== 0) doc.addPage();

      doc.setFontSize(14);
      doc.text(reportName, 14, 20);

      const tableColumn = ["Description", "%", "This Year", "Last Year"];
      const tableRows = groupedLoans[reportName].map(loan => [
        loan.itemDescription,
        loan.percentage,
        loan.thisYear,
        loan.lastYear,
      ]);

      autoTable(doc, {
        startY: 30,
        head: [tableColumn],
        body: tableRows,
      });
    });

    doc.save(`SurplusFund_Report.pdf`);
  };


  return (
    <div>

      {/* Export Buttons */}
      <div className="d-flex gap-2 mb-3 justify-content-end">
        <button 
         className="btn btn-md rounded-4 text-white px-4 fs-6"
            style={{ backgroundColor: "#033E96" }} onClick={exportToExcel}>
          Export Excel
        </button>
        <button className="btn btn-md rounded-4 px-4 fs-6 border" onClick={exportToPDF}>
          Export PDF
        </button>
      </div>

      {/* Table */}
      <div className='table-responsive' id='customers'>
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Description</th>
              <th>%</th>
              <th>This year</th>
              <th>Last year</th>
            </tr>
          </thead>

          {Object.keys(groupedLoans).map(reportName => (
            <tbody key={reportName}>
              {groupedLoans[reportName].map(loan => (
                <tr key={loan.sn}>
                  <td>{loan.itemDescription}</td>
                  <td>{loan.percentage}</td>
                  <td>{loan.thisYear}</td>
                  <td>{loan.lastYear}</td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default SurplusFund;
