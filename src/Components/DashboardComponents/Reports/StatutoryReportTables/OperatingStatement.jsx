import React from 'react';
import * as XLSX from 'xlsx';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const OperatingStatement = ({ financialPositionNoteReports, startDate, endDate }) => {

  // ---------------------------------------------
  // EXPORT TO EXCEL
  // ---------------------------------------------
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    Object.keys(financialPositionNoteReports).forEach(itemDesc => {
      const data = financialPositionNoteReports[itemDesc].map(loan => ({
        "Item Code": loan.itemCode,
        "Last Year": loan.lastYear,
        "This Year": loan.thisYear,
        "Increase/Decrease": loan.increaseDecreaseOverLastYear,
        "Remarks (%)": loan.remarkPercentageOfIncreaseDecrease,
      }));

      const ws = XLSX.utils.json_to_sheet(data);

      // Sanitize sheet name (Excel does not allow : \ / ? * [ ])
      const safeSheetName = itemDesc.replace(/[:\\\/\?\*\[\]]/g, "").substring(0, 31);

      XLSX.utils.book_append_sheet(workbook, ws, safeSheetName);
    });

    XLSX.writeFile(workbook, `OperatingStatement_${startDate}_to_${endDate}.xlsx`);
  };



  // ---------------------------------------------
  // EXPORT TO PDF
  // ---------------------------------------------
  const exportToPDF = () => {
    const doc = new jsPDF();

    Object.keys(financialPositionNoteReports).forEach((itemDesc, idx) => {
      if (idx !== 0) doc.addPage();

      doc.setFontSize(14);
      doc.text(itemDesc, 14, 20);

      const tableColumn = [
        "Item Code",
        "Last Year",
        "This Year",
        "Increase/Decrease",
        "Remarks (%)"
      ];

      const tableRows = financialPositionNoteReports[itemDesc].map(loan => [
        loan.itemCode,
        loan.lastYear.toFixed(2),
        loan.thisYear.toFixed(2),
        loan.increaseDecreaseOverLastYear.toFixed(2),
        loan.remarkPercentageOfIncreaseDecrease.toFixed(2),
      ]);

      autoTable(doc, {
        startY: 30,
        head: [tableColumn],
        body: tableRows,
      });
    });

    doc.save(`OperatingStatement_${startDate}_to_${endDate}.pdf`);
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
              <th></th>
              <th>Last Year</th>
              <th>This Year</th>
              <th>Increase/Decrease</th>
              <th>Remarks %</th>
            </tr>
          </thead>

          {Object.keys(financialPositionNoteReports).map(itemDesc => (
            <tbody key={itemDesc}>
              <tr>
                <td colSpan="5" style={{ color: '#0452C8', backgroundColor: '#F5F9FF' }}>
                  {itemDesc}
                </td>
              </tr>

              {financialPositionNoteReports[itemDesc].map(loan => (
                <tr key={loan.sn}>
                  <td>{loan.itemCode}</td>
                  <td>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(loan.lastYear)}</td>
                  <td>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(loan.thisYear)}</td>
                  <td>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(loan.increaseDecreaseOverLastYear)}</td>
                  <td>{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(loan.remarkPercentageOfIncreaseDecrease)}</td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  );
};

export default OperatingStatement;
